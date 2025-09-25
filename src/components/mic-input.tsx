"use client";

import { useState } from "react";
import { useAudioStore } from "../store/audio-store";
import * as engine from "../lib/audio-engine";

export default function MicInput() {
  const [isStarting, setIsStarting] = useState(false);
  const setEngine = useAudioStore((s) => s.setEngine);
  const setSourceKind = useAudioStore((s) => s.setSourceKind);
  const setError = useAudioStore((s) => s.setError);
  const stop = useAudioStore((s) => s.stop);

  const onStart = async () => {
    setIsStarting(true);
    stop();
    try {
      const eng = await engine.fromMic();
      setEngine(eng);
      setSourceKind("mic");
    } catch (e: any) {
      setError(e?.message ?? "Microphone permission denied");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <button
      onClick={onStart}
      disabled={isStarting}
      className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
    >
      {isStarting ? "Starting..." : "Start Microphone"}
    </button>
  );
}


