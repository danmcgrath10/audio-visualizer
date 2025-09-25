"use client";

import { useAudioStore, VisualizationMode, ColorTheme } from "../store/audio-store";
import VideoRecorder from "./video-recorder";
import MIDIController from "./midi-controller";
import AudioAnalysis from "./audio-analysis";

const FFT_SIZES = [256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
const VISUALIZATION_MODES: { value: VisualizationMode; label: string; icon: string }[] = [
  { value: "bars", label: "Bars", icon: "📊" },
  { value: "radial", label: "Radial", icon: "🌀" },
  { value: "waveform", label: "Wave", icon: "〰️" },
  { value: "space", label: "Space", icon: "🌌" },
  { value: "spiral", label: "Spiral", icon: "🌀" },
  { value: "rings", label: "Rings", icon: "⭕" },
  { value: "tunnel", label: "Tunnel", icon: "🕳️" },
  { value: "galaxy", label: "Galaxy", icon: "🌌" },
];

const COLOR_THEMES: { value: ColorTheme; label: string; colors: string[] }[] = [
  { value: "neon", label: "Neon", colors: ["#7aa2f7", "#bb9af7", "#7dcfb6"] },
  { value: "ocean", label: "Ocean", colors: ["#4facfe", "#00f2fe", "#43e97b"] },
  { value: "sunset", label: "Sunset", colors: ["#fa709a", "#fee140", "#ffa726"] },
  { value: "forest", label: "Forest", colors: ["#11998e", "#38ef7d", "#a8e6cf"] },
  { value: "cyberpunk", label: "Cyber", colors: ["#f093fb", "#f5576c", "#4facfe"] },
  { value: "monochrome", label: "Mono", colors: ["#ffffff", "#9ca3af", "#374151"] },
];

export default function ControlPanel() {
  const {
    visualizationMode,
    colorTheme,
    fftSize,
    smoothing,
    sensitivity,
    setVisualizationMode,
    setColorTheme,
    setFFTSize,
    setSmoothing,
    setSensitivity,
  } = useAudioStore();

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-6">
      <h3 className="text-xl font-semibold text-center text-blue-400">🎛️ Controls</h3>
      
      {/* Visualization Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Visualization Mode</label>
        <div className="grid grid-cols-4 gap-2">
          {VISUALIZATION_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setVisualizationMode(mode.value)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                visualizationMode === mode.value
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <div className="text-lg mb-1">{mode.icon}</div>
              <div>{mode.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Theme Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Color Theme</label>
        <div className="grid grid-cols-3 gap-2">
          {COLOR_THEMES.map((theme) => (
            <button
              key={theme.value}
              onClick={() => setColorTheme(theme.value)}
              className={`p-3 rounded-lg text-xs font-medium transition-all ${
                colorTheme === theme.value
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <div className="flex gap-1 mb-2 justify-center">
                {theme.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>{theme.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Audio Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-300">Audio Settings</h4>
        
        {/* FFT Size */}
        <div>
          <label className="block text-xs text-slate-400 mb-2">FFT Size: {fftSize}</label>
          <select
            value={fftSize}
            onChange={(e) => setFFTSize(Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
          >
            {FFT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Smoothing */}
        <div>
          <label className="block text-xs text-slate-400 mb-2">
            Smoothing: {smoothing.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="0.95"
            step="0.05"
            value={smoothing}
            onChange={(e) => setSmoothing(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Sensitivity */}
        <div>
          <label className="block text-xs text-slate-400 mb-2">
            Sensitivity: {sensitivity.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Video Recording */}
      <VideoRecorder />

      {/* MIDI Controller */}
      <MIDIController />

      {/* Audio Analysis */}
      <AudioAnalysis />

      {/* Keyboard Shortcuts */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300">Shortcuts</h4>
        <div className="text-xs text-slate-400 space-y-1">
          <div>Space - Play/Pause</div>
          <div>R - Restart</div>
          <div>V - Create Video</div>
          <div>1-8 - Switch Modes</div>
        </div>
      </div>
    </div>
  );
}
