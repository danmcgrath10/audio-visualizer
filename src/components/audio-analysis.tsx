"use client";

import { useState, useEffect } from "react";
import { useAudioStore } from "../store/audio-store";

interface AnalysisData {
  bpm: number;
  key: string;
  bassLevel: number;
  midLevel: number;
  highLevel: number;
}

export default function AudioAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisData>({
    bpm: 0,
    key: "--",
    bassLevel: 0,
    midLevel: 0,
    highLevel: 0,
  });

  const engine = useAudioStore((s) => s.engine);

  useEffect(() => {
    if (!engine) return;

    const analyser = engine.analyser;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    let lastTime = 0;
    let beatCount = 0;
    let beatTimes: number[] = [];

    const analyze = () => {
      analyser.getByteFrequencyData(dataArray);
      analyser.getByteTimeDomainData(timeData);

      // Calculate frequency band levels
      const bassEnd = Math.floor(bufferLength * 0.1);
      const midEnd = Math.floor(bufferLength * 0.4);
      
      const bassLevel = Array.from(dataArray.slice(0, bassEnd)).reduce((sum, val) => sum + val, 0) / bassEnd / 255;
      const midLevel = Array.from(dataArray.slice(bassEnd, midEnd)).reduce((sum, val) => sum + val, 0) / (midEnd - bassEnd) / 255;
      const highLevel = Array.from(dataArray.slice(midEnd)).reduce((sum, val) => sum + val, 0) / (bufferLength - midEnd) / 255;

      // Simple BPM detection using time domain data
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime;
      
      if (timeDiff > 100) { // Analyze every 100ms
        const rms = Math.sqrt(Array.from(timeData).reduce((sum, val) => sum + (val - 128) ** 2, 0) / bufferLength);
        const threshold = 20; // Adjust based on audio level
        
        if (rms > threshold) {
          beatTimes.push(currentTime);
          beatCount++;
          
          // Keep only recent beats (last 10 seconds)
          beatTimes = beatTimes.filter(time => currentTime - time < 10000);
          
          // Calculate BPM from recent beats
          if (beatTimes.length > 1) {
            const timeSpan = (beatTimes[beatTimes.length - 1] - beatTimes[0]) / 1000;
            const bpm = beatTimes.length > 1 ? (beatTimes.length - 1) * 60 / timeSpan : 0;
            
            setAnalysis(prev => ({
              ...prev,
              bpm: Math.round(bpm),
              bassLevel,
              midLevel,
              highLevel,
            }));
          }
        }
        
        lastTime = currentTime;
      }

      // Simple key detection (very basic)
      const dominantFreq = dataArray.indexOf(Math.max(...dataArray));
      const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      const keyIndex = Math.floor((dominantFreq / bufferLength) * 12);
      const key = keys[keyIndex] || "--";

      setAnalysis(prev => ({
        ...prev,
        key,
      }));

      requestAnimationFrame(analyze);
    };

    analyze();
  }, [engine]);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-300">📊 Audio Analysis</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">BPM</div>
          <div className="text-lg font-bold text-blue-400">{analysis.bpm || "--"}</div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Key</div>
          <div className="text-lg font-bold text-purple-400">{analysis.key}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-slate-400">Frequency Bands</div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-xs w-12 text-slate-400">Bass</div>
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${analysis.bassLevel * 100}%` }}
              />
            </div>
            <div className="text-xs w-8 text-slate-400">{Math.round(analysis.bassLevel * 100)}%</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs w-12 text-slate-400">Mid</div>
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${analysis.midLevel * 100}%` }}
              />
            </div>
            <div className="text-xs w-8 text-slate-400">{Math.round(analysis.midLevel * 100)}%</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs w-12 text-slate-400">High</div>
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${analysis.highLevel * 100}%` }}
              />
            </div>
            <div className="text-xs w-8 text-slate-400">{Math.round(analysis.highLevel * 100)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
