import { useState } from "react";
import { HiMicrophone, HiStopCircle } from "react-icons/hi2";

export const AudioRecorder = ({ fileReady }) => {
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const onMicrophoneClick = async () => {
        if (recording) {
            setRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            return;
        }
        setRecording(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const newMediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            newMediaRecorder.addEventListener("dataavailable", (event) => {
                chunks.push(event.data);
            });

            newMediaRecorder.addEventListener("stop", () => {
                let audioBlob = new Blob(chunks, {
                    type: "audio/ogg; codecs=opus",
                });
                let audioFile = new File([audioBlob], "recorded_audio.ogg", {
                    type: "audio/ogg; codecs=opus",
                });
                const url = URL.createObjectURL(audioFile);

                fileReady(audioFile, url);
            });

            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);
        } catch (error) {
            setRecording(false);
            console.error("Error accessing microphone", error);
        }
    };

    return (
        <button
            onClick={onMicrophoneClick}
            className="p-1 text-gray-400 hover:text-gray-200"
        >
            {recording && <HiStopCircle className="w6 text-red-600" />}
            {!recording && <HiMicrophone className="w6" />}
        </button>
    );
};
