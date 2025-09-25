export type EngineResult = {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  teardown: () => void;
};

const createAnalyser = (audioContext: AudioContext) => {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.8;
  return analyser;
};

export async function fromFile(file: File): Promise<EngineResult> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = await audioContext.decodeAudioData(arrayBuffer);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  const analyser = createAnalyser(audioContext);
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  source.start(0);

  const teardown = () => {
    try {
      source.stop();
      source.disconnect();
      analyser.disconnect();
      audioContext.close();
    } catch {}
  };

  return { audioContext, analyser, teardown };
}

export async function fromMic(): Promise<EngineResult> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = createAnalyser(audioContext);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  const teardown = () => {
    try {
      stream.getTracks().forEach((t) => t.stop());
      analyser.disconnect();
      audioContext.close();
    } catch {}
  };

  return { audioContext, analyser, teardown };
}


