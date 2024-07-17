<?php

namespace App\Observers;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Support\Facades\Storage;

class MessageObserver
{
    // listen when when message is deleted

    public function deleting (Message $message) {
        // Iterate over the message Attachments and delete them from FS
            $message->attachments->each(function($attachment) {
            // Delete the attachment from FS
            $dir = dirname($attachment->path);
            Storage::disk('public')->delete($dir);
        });

        // delete all attachments related to the message from DB
        $message->attachments()->delete();

        // If message is last message of a conversation or group conversation, update Group / Conversation

        if($message->group_id) {
            $group = Group::where('last_message_id', $message->id)->first();

            if($group) {
                $prevMessage = Message::where('group_id', $group->id)
                    ->where('id', '!=', $message->id)
                    ->latest()
                    ->limit(1)
                    ->first();

                if($prevMessage) {
                    $group->last_message_id = $prevMessage->id;
                    $group->save();
                }
            }
        } else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();

            if($conversation) {
                $prevMessage = Message::where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                    ->where('id', '!=', $message->id)
                    ->latest()
                    ->limit(1)
                    ->first();

                if($prevMessage) {
                    $conversation->last_message_id = $prevMessage->id;
                    $conversation->save();
                }
            }
        }
    }
}
