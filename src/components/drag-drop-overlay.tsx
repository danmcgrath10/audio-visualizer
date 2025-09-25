"use client";

import { useState, useEffect } from "react";
import { useAudioStore } from "../store/audio-store";

const SUPPORTED_FORMATS = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.aac'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function DragDropOverlay() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  
  const setEngine = useAudioStore((s) => s.setEngine);
  const setSourceKind = useAudioStore((s) => s.setSourceKind);
  const setError = useAudioStore((s) => s.setError);
  const stop = useAudioStore((s) => s.stop);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_FORMATS.includes(extension)) {
      return `Unsupported format. Supported: ${SUPPORTED_FORMATS.join(', ')}`;
    }

    // Check MIME type
    const audioMimeTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'audio/flac',
      'audio/ogg',
      'audio/aac',
      'audio/x-m4a',
    ];
    
    if (!audioMimeTypes.includes(file.type) && !file.type.startsWith('audio/')) {
      return 'File does not appear to be an audio file';
    }

    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    stop();
    setError(null);

    try {
      // Create a simple audio context for file loading
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.8;
      
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      setEngine({
        audioContext,
        analyser,
        teardown: () => {
          try {
            audioContext.close();
          } catch (e) {
            // Ignore errors
          }
        },
      });
      setSourceKind("file");
    } catch (error: any) {
      setError(error?.message || "Failed to load audio file");
    }
  };

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => prev + 1);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => prev - 1);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(0);
      setIsDragging(false);

      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    };

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  useEffect(() => {
    setIsDragging(dragCounter > 0);
  }, [dragCounter]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 bg-blue-500/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-900/95 border-4 border-dashed border-blue-400 rounded-2xl p-12 text-center max-w-md mx-4">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-2xl font-bold text-white mb-2">Drop Audio File</h3>
        <p className="text-slate-300 mb-4">
          Drop your audio file here to start visualizing
        </p>
        <div className="text-sm text-slate-400">
          <div>Supported formats: MP3, WAV, M4A, FLAC, OGG</div>
          <div>Maximum size: 100MB</div>
        </div>
      </div>
    </div>
  );
}
