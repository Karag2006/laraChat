import { isAudio, isImage, isPDF, isPreviewable, isVideo } from "@/helpers";
import { HiArrowDownTray, HiPaperClip, HiPlayCircle } from "react-icons/hi2";

export const MessageAttachments = ({ attachments, attachmentClick }) => {
    return (
        <>
            {attachments.length > 0 && (
                <div className="mt-2 flex-wrap justify-end gap-1">
                    {attachments.map((attachment, index) => (
                        <div
                            key={attachment.id}
                            className={`group flex flex-col items-center justify-center text-gray-500 relative cursor-pointer
                                ${
                                    isAudio(attachment)
                                        ? "w-84"
                                        : "w-32 aspect-square bg-blue-100"
                                }
                                `}
                            onClick={() => attachmentClick(attachments, index)}
                        >
                            {!isAudio(attachment) && (
                                <a
                                    href={attachment.url}
                                    onClick={(event) => event.stopPropagation()}
                                    download
                                    className="z-20 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center text-gray-100 bg-gray-700 rounded absolute right-0 top-0 cursor-pointer hover:bg-gray-800"
                                >
                                    <HiArrowDownTray className="w-4 h-4" />
                                </a>
                            )}

                            {isImage(attachment) && (
                                <img
                                    src={attachment.url}
                                    className="object-contain aspect-square w-full"
                                />
                            )}
                            {isVideo(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <HiPlayCircle className="z-20 absolute w-16 h-16 text-white opacity-70" />

                                    <div className="absolute left-0 top-0 w-full h-full bg-black/50 z-10"></div>
                                    <video src={attachment.url}></video>
                                </div>
                            )}
                            {isAudio(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <audio src={attachment.url} controls />
                                </div>
                            )}
                            {isPDF(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <div className="absolute left-0 top-0 right-0 bottom-0"></div>
                                    <iframe
                                        src={attachment.url}
                                        className="w-full h-full"
                                    />
                                </div>
                            )}
                            {!isPreviewable(attachment) && (
                                <a
                                    href={attachment.url}
                                    onClick={(event) => event.stopPropagation()}
                                    download
                                    className="flex flex-col justify-center items-center"
                                >
                                    <HiPaperClip className="w-10 h-10 mb-3" />
                                    <small className="text-center">
                                        {attachment.name}
                                    </small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
