"use client";

import { useEffect } from "react";
import { useAudioStore } from "../store/audio-store";

export function useKeyboardShortcuts() {
  const {
    visualizationMode,
    setVisualizationMode,
    setRecording,
    isRecording,
    engine,
    setPlaying,
    isPlaying,
  } = useAudioStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case " ":
          event.preventDefault();
          if (engine) {
            setPlaying(!isPlaying);
          }
          break;
        
        case "r":
          event.preventDefault();
          if (engine) {
            // Restart audio
            setPlaying(false);
            setTimeout(() => setPlaying(true), 100);
          }
          break;
        
        case "v":
          event.preventDefault();
          if (engine && !isRecording) {
            setRecording(true);
            // Simulate recording
            setTimeout(() => setRecording(false), 5000);
          }
          break;
        
        case "1":
          event.preventDefault();
          setVisualizationMode("bars");
          break;
        case "2":
          event.preventDefault();
          setVisualizationMode("radial");
          break;
        case "3":
          event.preventDefault();
          setVisualizationMode("waveform");
          break;
        case "4":
          event.preventDefault();
          setVisualizationMode("space");
          break;
        case "5":
          event.preventDefault();
          setVisualizationMode("spiral");
          break;
        case "6":
          event.preventDefault();
          setVisualizationMode("rings");
          break;
        case "7":
          event.preventDefault();
          setVisualizationMode("tunnel");
          break;
        case "8":
          event.preventDefault();
          setVisualizationMode("galaxy");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [engine, isPlaying, isRecording, setPlaying, setRecording, setVisualizationMode]);
}
