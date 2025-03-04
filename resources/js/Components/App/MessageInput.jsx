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
    HiXCircle,
} from "react-icons/hi2";

import { DynamicMessageInput } from "@/Components/App/DynamicMessageInput";
import { isAudio, isImage } from "@/helpers";
import { AttachmentPreview } from "./AttachmentPreview";
import { CustomAudioPlayer } from "./CustomAudioPlayer";
import { AudioRecorder } from "./AudioRecorder";

export const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onFileChange = (event) => {
        const files = event.target.files;

        const updatedFiles = [...files].map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file),
            };
        });
        event.target.value = null;

        setChosenFiles((prevFiles) => {
            return [...prevFiles, ...updatedFiles];
        });
    };

    const closeEmojiPicker = useClose();

    const onSendClick = () => {
        if (messageSending) return;

        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMessage("Please provide a message");
            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);
            return;
        }
        const formData = new FormData();
        chosenFiles.forEach((file) => {
            formData.append("attachments[]", file.file);
        });
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
                    setUploadProgress(progress);
                },
            })
            .then((response) => {
                setNewMessage("");
                setMessageSending(false);
                setUploadProgress(0);
                setChosenFiles([]);
            })
            .catch((error) => {
                setMessageSending(false);
                setChosenFiles([]);
                const message = error?.response?.data?.message;
                setInputErrorMessage(
                    message || "An error occurred while sending message"
                );
            });
    };

    const onLikeClick = () => {
        if (messageSending) return;

        const data = {
            message: "👍",
        };
        if (conversation.is_user) {
            data["receiver_id"] = conversation.id;
        } else if (conversation.is_group) {
            data["group_id"] = conversation.id;
        }

        axios.post(route("message.store"), data);
    };

    const recordedAudioReady = (file, url) => {
        setChosenFiles((prevFiles) => [...prevFiles, { file, url }]);
    };

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex xs:flex-none xs:order-1 p-2">
                <label
                    htmlFor="fileUpload"
                    className="p-1 text-gray-400 hoverfocus:text-gray-300 cursor-pointer"
                >
                    <HiPaperClip className="w-6" />
                    <input
                        id="fileUpload"
                        onChange={onFileChange}
                        type="file"
                        multiple
                        className="hidden"
                    />
                </label>
                <label
                    htmlFor="imageUpload"
                    className="p-1 text-gray-400 hoverfocus:text-gray-300 cursor-pointer"
                >
                    <HiPhoto className="w-6" />
                    <input
                        id="imageUpload"
                        onChange={onFileChange}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                    />
                </label>
                <AudioRecorder fileReady={recordedAudioReady} />
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
                {!!uploadProgress && (
                    <progress className="progress progress-info w-full"></progress>
                )}
                {inputErrorMessage && (
                    <p className="text-xs text-red-400">{inputErrorMessage}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.map((file) => (
                        <div
                            key={file.file.name}
                            className={`relative flex justify-between cursor-pointer ${
                                !isImage(file.file) ? "w-[240px]" : ""
                            }`}
                        >
                            {isImage(file.file) && (
                                <img
                                    src={file.url}
                                    alt=""
                                    className="w-16 h-16 object-cover"
                                />
                            )}
                            {isAudio(file.file) && (
                                <CustomAudioPlayer
                                    file={file}
                                    showVolume={false}
                                />
                            )}

                            {!isAudio(file.file) && !isImage(file.file) && (
                                <AttachmentPreview file={file} />
                            )}

                            <button
                                onClick={() =>
                                    setChosenFiles(
                                        chosenFiles.filter(
                                            (f) =>
                                                f.file.name !== file.file.name
                                        )
                                    )
                                }
                                className="absolute w-6 h-6 rounded-full bg-gray-800 -right-2 -top-2 text-gray-300 hoverfocus:text-gray-100 z-10"
                            >
                                <HiXCircle className="w-6" />
                            </button>
                        </div>
                    ))}
                </div>
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
                <button
                    onClick={onLikeClick}
                    className="p-1 text-gray-400 hoverfocus:text-gray-300"
                >
                    <HiHandThumbUp className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
