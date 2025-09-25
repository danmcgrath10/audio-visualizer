"use client";

import { useCallback, useRef, useState } from "react";
import { useAudioStore } from "../store/audio-store";
import * as engine from "../lib/audio-engine";

export default function Uploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setEngine = useAudioStore((s) => s.setEngine);
  const setSourceKind = useAudioStore((s) => s.setSourceKind);
  const setError = useAudioStore((s) => s.setError);
  const stop = useAudioStore((s) => s.stop);
  const [isDragging, setIsDragging] = useState(false);

  const activate = useCallback(async (file: File) => {
    stop();
    try {
      const eng = await engine.fromFile(file);
      setEngine(eng);
      setSourceKind("file");
    } catch (e: any) {
      setError(e?.message ?? "Failed to load file");
    }
  }, [setEngine, setSourceKind, setError, stop]);

  const onInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) activate(file);
  }, [activate]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) activate(file);
  }, [activate]);

  return (
    <div className="space-y-3">
      <div
        className={`drop-zone border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragging ? "border-blue-400 bg-blue-400/10" : "border-slate-700 bg-white/0"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="text-slate-300">Drop audio file here or click to choose</div>
        <div className="text-slate-500 text-sm">MP3, WAV, M4A, FLAC</div>
      </div>
      <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={onInputChange} />
    </div>
  );
}


