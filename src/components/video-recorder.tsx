"use client";

import { useRef, useEffect, useState } from "react";
import { useAudioStore } from "../store/audio-store";

export default function VideoRecorder() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const {
    engine,
    visualizationMode,
    colorTheme,
    sensitivity,
    setRecording,
    setRecordingProgress,
  } = useAudioStore();

  const startRecording = async () => {
    if (!canvasRef.current || !engine) return;

    try {
      const canvas = canvasRef.current;
      const stream = canvas.captureStream(30); // 30 FPS
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setIsRecording(false);
        setRecording(false);
        setRecordingProgress(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecording(true);

      // Simulate recording progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 0.1;
        setLocalProgress(progress);
        setRecordingProgress(progress);
        if (progress >= 1) {
          clearInterval(progressInterval);
          mediaRecorder.stop();
        }
      }, 100);

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setRecording(false);
    }
  };

  const downloadVideo = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `eargoo-visualization-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const startNewRecording = () => {
    setDownloadUrl(null);
    startRecording();
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-300">Video Recording</h4>
      
      {!isRecording && !downloadUrl && (
        <button
          onClick={startRecording}
          disabled={!engine}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-all"
        >
          🎬 Start Recording
        </button>
      )}

      {isRecording && (
        <div className="space-y-2">
          <div className="text-sm text-slate-400">
            Recording... {Math.round(localProgress * 100)}%
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${localProgress * 100}%` }}
            />
          </div>
        </div>
      )}

      {downloadUrl && (
        <div className="space-y-2">
          <div className="text-sm text-green-400">Recording Complete!</div>
          <div className="flex gap-2">
            <button
              onClick={downloadVideo}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
            >
              📥 Download Video
            </button>
            <button
              onClick={startNewRecording}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
            >
              🎬 New Recording
            </button>
          </div>
        </div>
      )}

      <div className="text-xs text-slate-500">
        <div>Resolution: 800x256 (9:16)</div>
        <div>Format: WebM (VP9)</div>
        <div>Frame Rate: 30 FPS</div>
      </div>
    </div>
  );
}
