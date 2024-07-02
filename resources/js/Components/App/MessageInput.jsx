import { useState } from "react";

import EmojiPicker from "emoji-picker-react";
import {
    Popover,
    PopoverButton,
    PopoverPanel,
    useClose,
} from "@headlessui/react";
import {
    HiFaceSmile,
    HiHandThumbUp,
    HiPaperAirplane,
    HiPaperClip,
    HiPhoto,
} from "react-icons/hi2";

import { DynamicMessageInput } from "@/Components/App/DynamicMessageInput";

export const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);

    const closeEmojiPicker = useClose();

    const onSendClick = () => {
        if (messageSending) return;

        if (newMessage.trim() === "") {
            setInputErrorMessage("Please provide a message");
            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);
            return;
        }
        const formData = new FormData();
        formData.append("message", newMessage);
        if (conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            formData.append("group_id", conversation.id);
        }
        setMessageSending(true);
        axios
            .post(route("message.store"), formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    console.log(progress);
                },
            })
            .then((response) => {
                setNewMessage("");
                setMessageSending(false);
            })
            .catch((error) => {
                setMessageSending(false);
                console.error(error);
            });
    };

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hoverfocus:text-gray-300 relative">
                    <HiPaperClip className="w-6" />
                    <input
                        type="file"
                        multiple
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-400 hoverfocus:text-gray-300 relative">
                    <HiPhoto className="w-6" />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
            </div>
            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <DynamicMessageInput
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onSend={onSendClick}
                    />
                    <button
                        onClick={onSendClick}
                        disabled={messageSending}
                        className="btn btn-info rounded-l-none"
                    >
                        <HiPaperAirplane className="w-6" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
                {inputErrorMessage && (
                    <p className="text-xs text-red-400">{inputErrorMessage}</p>
                )}
            </div>

            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="relative">
                    <PopoverButton className="p-1 text-gray-400 hoverfocus:text-gray-300">
                        <HiFaceSmile className="w-6 h-6" />
                    </PopoverButton>
                    <PopoverPanel
                        anchor="top end"
                        transition
                        className="flex origin-top flex-col transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={(event) => {
                                setNewMessage(newMessage + event.emoji);
                                closeEmojiPicker();
                            }}
                        />
                    </PopoverPanel>
                </Popover>
                <button className="p-1 text-gray-400 hoverfocus:text-gray-300">
                    <HiHandThumbUp className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
