"use client";

import { create } from "zustand";

export type AudioEngine = {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  teardown: () => void;
};

export type VisualizationMode = "bars" | "radial" | "waveform" | "space" | "spiral" | "rings" | "tunnel" | "galaxy";

export type ColorTheme = "neon" | "ocean" | "sunset" | "forest" | "cyberpunk" | "monochrome";

type AudioSourceKind = "none" | "file" | "mic";

type AudioState = {
  engine?: AudioEngine;
  sourceKind: AudioSourceKind;
  isPlaying: boolean;
  error?: string;
  
  // Visualization settings
  visualizationMode: VisualizationMode;
  colorTheme: ColorTheme;
  
  // Audio analysis settings
  fftSize: number;
  smoothing: number;
  sensitivity: number;
  
  // Video recording
  isRecording: boolean;
  recordingProgress: number;
  
  // Actions
  setEngine: (engine?: AudioEngine) => void;
  setSourceKind: (kind: AudioSourceKind) => void;
  setPlaying: (playing: boolean) => void;
  setError: (err?: string) => void;
  setVisualizationMode: (mode: VisualizationMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setFFTSize: (size: number) => void;
  setSmoothing: (value: number) => void;
  setSensitivity: (value: number) => void;
  setRecording: (recording: boolean) => void;
  setRecordingProgress: (progress: number) => void;
  stop: () => void;
};

export const useAudioStore = create<AudioState>((set, get) => ({
  engine: undefined,
  sourceKind: "none",
  isPlaying: false,
  error: undefined,
  
  // Visualization settings
  visualizationMode: "bars",
  colorTheme: "neon",
  
  // Audio analysis settings
  fftSize: 1024,
  smoothing: 0.8,
  sensitivity: 1.0,
  
  // Video recording
  isRecording: false,
  recordingProgress: 0,
  
  // Actions
  setEngine: (engine) => set({ engine }),
  setSourceKind: (kind) => set({ sourceKind: kind }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setError: (error) => set({ error }),
  setVisualizationMode: (mode) => set({ visualizationMode: mode }),
  setColorTheme: (theme) => set({ colorTheme: theme }),
  setFFTSize: (size) => set({ fftSize: size }),
  setSmoothing: (value) => set({ smoothing: value }),
  setSensitivity: (value) => set({ sensitivity: value }),
  setRecording: (recording) => set({ isRecording: recording }),
  setRecordingProgress: (progress) => set({ recordingProgress: progress }),
  stop: () => {
    const engine = get().engine;
    try {
      engine?.teardown();
    } catch (e) {
      // noop
    }
    set({ 
      engine: undefined, 
      sourceKind: "none", 
      isPlaying: false,
      isRecording: false,
      recordingProgress: 0
    });
  },
}));


