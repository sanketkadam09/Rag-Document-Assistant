// src/components/VoiceRecorder.jsx
import { useState, useRef } from "react";
import axios from "axios";

function VoiceRecorder({ setInput, setInputFromVoice }) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

      mediaRecorder.onstop = async () => {
        setProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
          const res = await axios.post("http://localhost:5000/voice", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (res.data.success) {
            setInput(res.data.text);
            setInputFromVoice(res.data.text);
          } else {
            alert("Voice conversion failed");
          }
        } catch (err) {
          console.error(err);
          alert("Error sending audio");
        } finally {
          setProcessing(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
      alert("Microphone permission denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    setRecording(false);
  };

  return (
    <>
      <style>{`
        .mic-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1px solid #252838;
          background: #1a1d27;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
          position: relative;
        }

        .mic-btn:hover:not(:disabled) {
          background: #252838;
          border-color: #374151;
        }

        .mic-btn.recording {
          background: rgba(239,68,68,0.12);
          border-color: #ef4444;
          animation: mic-pulse 1.5s infinite;
        }

        .mic-btn.processing {
          background: rgba(99,102,241,0.1);
          border-color: #6366f1;
          cursor: not-allowed;
        }

        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }

        .mic-spinner {
          width: 14px; height: 14px;
          border: 2px solid #252838;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <button
        className={`mic-btn ${recording ? "recording" : ""} ${processing ? "processing" : ""}`}
        onClick={recording ? stopRecording : startRecording}
        disabled={processing}
        title={recording ? "Stop recording" : processing ? "Processing…" : "Start voice input"}
      >
        {processing ? (
          <div className="mic-spinner"></div>
        ) : recording ? (
          // Stop icon
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#ef4444">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
          </svg>
        ) : (
          // Mic icon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        )}
      </button>
    </>
  );
}

export default VoiceRecorder;