<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function (User $user) {
    return $user ? new UserResource($user) : null;
});

// Direct Messages:
Broadcast::channel('message.user.{userId1}-{userId2}', function (User $user, int $userId1, int $userId2) {
    // To avoid 2 channels for the same conversation
    // make sure that $userId1 < $userId2.
    return $user->id === $userId1 || $user->id === $userId2 ? new UserResource($user) : null;
});

// Group Messages:
Broadcast::channel('message.group.{groupId}', function (User $user, int $groupId) {
    return $user->groups->contains('id', $groupId) ? new UserResource($user) : null;
});
