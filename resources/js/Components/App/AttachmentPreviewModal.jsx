import { isAudio, isImage, isPDF, isPreviewable, isVideo } from "@/helpers";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import {
    HiChevronLeft,
    HiChevronRight,
    HiPaperClip,
    HiXMark,
} from "react-icons/hi2";

export const AttachmentPreviewModal = ({
    attachments,
    index,
    show = false,
    onClose = () => {},
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const attachment = useMemo(() => {
        return attachments[currentIndex];
    }, [attachments, currentIndex]);

    const previewableAttachments = useMemo(() => {
        return attachments.filter((attachment) => isPreviewable(attachment));
    }, [attachments]);

    const close = () => {
        onClose();
    };

    const prev = () => {
        if (currentIndex === 0) return;

        setCurrentIndex(currentIndex - 1);
    };
    const next = () => {
        if (currentIndex === previewableAttachments.length - 1) return;

        setCurrentIndex(currentIndex + 1);
    };

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    return (
        <Dialog
            open={show}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={close}
        >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full w-full rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <button
                            onClick={close}
                            className="absolute right-3 top-3 w-10 h10 rounded-full hover:bg-black/10 transition flex items-center justify-center text-gray-100 z-40"
                        >
                            <HiXMark className="w-6 h-6" />
                        </button>
                        <div className="relative group h-full">
                            {currentIndex > 0 && (
                                <div
                                    onClick={prev}
                                    className="preview-control-btn prev"
                                >
                                    <HiChevronLeft className="w-12" />
                                </div>
                            )}
                            {currentIndex <
                                previewableAttachments.length - 1 && (
                                <div
                                    onClick={next}
                                    className="preview-control-btn next"
                                >
                                    <HiChevronRight className="w-12" />
                                </div>
                            )}

                            {attachment && (
                                <div className="flex items-center justify-center w-full h-full p-3">
                                    {isImage(attachment) && (
                                        <img
                                            src={attachment.url}
                                            className="max-w-full max-h-full"
                                        />
                                    )}
                                    {isVideo(attachment) && (
                                        <div className="flex items-center">
                                            <video
                                                src={attachment.url}
                                                controls
                                                autoPlay
                                            />
                                        </div>
                                    )}
                                    {isAudio(attachment) && (
                                        <div className="relative flex justify-center items-center">
                                            <audio
                                                src={attachment.url}
                                                controls
                                                autoPlay
                                            />
                                        </div>
                                    )}
                                    {isPDF(attachment) && (
                                        <iframe
                                            src={attachment.url}
                                            className="w-full h-full"
                                        />
                                    )}
                                    {!isPreviewable(attachment) && (
                                        <div className="flex p-32 flex-col justify-center items-center text-gray-100">
                                            <HiPaperClip className="w-10 h-10 mb-3" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};
