"use client";

import { useAudioStore } from "../store/audio-store";

export default function StatusIndicator() {
  const {
    sourceKind,
    isPlaying,
    isRecording,
    visualizationMode,
    colorTheme,
    error,
  } = useAudioStore();

  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (isRecording) return "Recording video...";
    if (isPlaying && sourceKind === "file") return "Playing audio file";
    if (isPlaying && sourceKind === "mic") return "Live microphone input";
    if (sourceKind === "file") return "Audio file loaded - Press Space to play";
    if (sourceKind === "mic") return "Microphone connected - Press Space to start";
    return "Load an audio file or use microphone to begin";
  };

  const getStatusColor = () => {
    if (error) return "text-red-400";
    if (isRecording) return "text-green-400";
    if (isPlaying) return "text-blue-400";
    return "text-slate-400";
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-3 h-3 rounded-full ${
          error ? "bg-red-400" : 
          isRecording ? "bg-green-400 animate-pulse" : 
          isPlaying ? "bg-blue-400" : 
          "bg-slate-400"
        }`} />
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {sourceKind !== "none" && (
        <div className="text-xs text-slate-500 space-y-1">
          <div>Mode: {visualizationMode} • Theme: {colorTheme}</div>
          <div>Shortcuts: Space (play/pause) • R (restart) • V (record) • 1-8 (modes)</div>
        </div>
      )}
    </div>
  );
}
