"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "../store/audio-store";

const getThemeColors = (theme: string) => {
  const themes = {
    neon: ["#7aa2f7", "#bb9af7", "#7dcfb6"],
    ocean: ["#4facfe", "#00f2fe", "#43e97b"],
    sunset: ["#fa709a", "#fee140", "#ffa726"],
    forest: ["#11998e", "#38ef7d", "#a8e6cf"],
    cyberpunk: ["#f093fb", "#f5576c", "#4facfe"],
    monochrome: ["#ffffff", "#9ca3af", "#374151"],
  };
  return themes[theme as keyof typeof themes] || themes.neon;
};

export default function VisualizerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engine = useAudioStore((s) => s.engine);
  const visualizationMode = useAudioStore((s) => s.visualizationMode);
  const colorTheme = useAudioStore((s) => s.colorTheme);
  const sensitivity = useAudioStore((s) => s.sensitivity);

  useEffect(() => {
    if (!engine || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const analyser = engine.analyser;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const colors = getThemeColors(colorTheme);

    const render = () => {
      if (!canvasRef.current || !ctx) return;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(15,23,42,1)";
      ctx.fillRect(0, 0, width, height);

      analyser.getByteFrequencyData(dataArray);
      
      // Apply sensitivity
      const scaledData = dataArray.map(v => Math.min(255, v * sensitivity));

      switch (visualizationMode) {
        case "bars":
          renderBars(ctx, width, height, scaledData, colors);
          break;
        case "radial":
          renderRadial(ctx, width, height, scaledData, colors);
          break;
        case "waveform":
          renderWaveform(ctx, width, height, scaledData, colors);
          break;
        case "space":
          renderSpace(ctx, width, height, scaledData, colors);
          break;
        case "spiral":
          renderSpiral(ctx, width, height, scaledData, colors);
          break;
        case "rings":
          renderRings(ctx, width, height, scaledData, colors);
          break;
        case "tunnel":
          renderTunnel(ctx, width, height, scaledData, colors);
          break;
        case "galaxy":
          renderGalaxy(ctx, width, height, scaledData, colors);
          break;
      }

      raf = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(raf);
  }, [engine, visualizationMode, colorTheme, sensitivity]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64 rounded-lg border border-slate-600 bg-slate-900/50"
      width={800}
      height={256}
    />
  );
}

// Visualization renderers
function renderBars(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array, colors: string[]) {
  const barWidth = Math.max(2, (width / data.length) * 2.5);
  const centerY = height / 2;
  
  for (let i = 0; i < data.length; i++) {
    const v = data[i] / 255;
    const barHeight = v * (height * 0.8);
    const x = (i / data.length) * width;
    
    // Create gradient for each bar
    const gradient = ctx.createLinearGradient(x, height, x, height - barHeight);
    const colorIndex = Math.floor((i / data.length) * colors.length);
    const nextColorIndex = (colorIndex + 1) % colors.length;
    
    gradient.addColorStop(0, colors[colorIndex] + '80');
    gradient.addColorStop(0.5, colors[colorIndex]);
    gradient.addColorStop(1, colors[nextColorIndex]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, centerY - barHeight/2, barWidth, barHeight);
    
    // Add glow effect
    ctx.shadowColor = colors[colorIndex];
    ctx.shadowBlur = 10;
    ctx.fillRect(x, centerY - barHeight/2, barWidth, barHeight);
    ctx.shadowBlur = 0;
  }
}

function renderRadial(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array, colors: string[]) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 30;
  
  // Draw center core
  const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 15);
  coreGradient.addColorStop(0, colors[0] + 'FF');
  coreGradient.addColorStop(1, colors[0] + '40');
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw frequency bars radiating outward
  for (let i = 0; i < data.length; i += 2) {
    const v = data[i] / 255;
    const angle = (i / data.length) * Math.PI * 2;
    const radius = 20 + v * maxRadius;
    const barWidth = 2;
    const barHeight = v * 20;
    
    const x1 = centerX + Math.cos(angle) * (radius - barHeight/2);
    const y1 = centerY + Math.sin(angle) * (radius - barHeight/2);
    const x2 = centerX + Math.cos(angle) * (radius + barHeight/2);
    const y2 = centerY + Math.sin(angle) * (radius + barHeight/2);
    
    const colorIndex = Math.floor((i / data.length) * colors.length);
    
    // Create radial gradient
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, colors[colorIndex] + '80');
    gradient.addColorStop(0.5, colors[colorIndex]);
    gradient.addColorStop(1, colors[colorIndex] + '40');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = barWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function renderWaveform(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array, colors: string[]) {
  const centerY = height / 2;
  const stepX = width / data.length;
  
  // Draw multiple waveform layers for depth
  for (let layer = 0; layer < 3; layer++) {
    ctx.beginPath();
    const layerOffset = layer * 0.3;
    const layerHeight = (height / 4) * (1 - layerOffset);
    const layerOpacity = 1 - layerOffset;
    
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      const x = i * stepX;
      const y = centerY + v * layerHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    const colorIndex = layer % colors.length;
    ctx.strokeStyle = colors[colorIndex] + Math.floor(layerOpacity * 255).toString(16).padStart(2, '0');
    ctx.lineWidth = 3 - layer;
    ctx.stroke();
  }
  
  // Add center line
  ctx.strokeStyle = colors[0] + '40';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
}

function renderSpace(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array, colors: string[]) {
  const centerX = width / 2;
  const centerY = height / 2;
  const time = Date.now() * 0.001;
  
  // Create starfield background
  for (let i = 0; i < 50; i++) {
    const starX = (i * 7.3) % width;
    const starY = (i * 11.7) % height;
    const starSize = Math.sin(i + time) * 0.5 + 0.5;
    
    ctx.fillStyle = colors[0] + '40';
    ctx.beginPath();
    ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Create audio-reactive particles
  for (let i = 0; i < data.length; i += 3) {
    const v = data[i] / 255;
    if (v > 0.05) {
      const angle = (i / data.length) * Math.PI * 2 + time * 0.5;
      const distance = 20 + v * 120;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      const colorIndex = Math.floor((i / data.length) * colors.length);
      const particleSize = v * 4 + 1;
      
      // Create particle with glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, particleSize * 2);
      gradient.addColorStop(0, colors[colorIndex] + 'FF');
      gradient.addColorStop(0.5, colors[colorIndex] + '80');
      gradient.addColorStop(1, colors[colorIndex] + '00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, particleSize * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Core particle
      ctx.fillStyle = colors[colorIndex];
      ctx.beginPath();
      ctx.arc(x, y, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function renderSpiral(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array, colors: string[]) {
  const centerX = width / 2;
  const centerY = height / 2;
  const time = Date.now() * 0.001;
  const maxRadius = Math.min(width, height) / 2 - 20;
  
  // Draw spiral path
  ctx.beginPath();
  let firstPoint = true;
  
  for (let i = 0; i < data.length; i += 2) {
    const v = data[i] / 255;
    const angle = (i / data.length) * Math.PI * 6 + time * 2;
    const radius = 10 + (i / data.length) * maxRadius + v * 30;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (firstPoint) {
      ctx.moveTo(x, y);
      firstPoint = false;
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  // Create spiral gradient
  const gradient = ctx.createLinearGradient(centerX, centerY, centerX + maxRadius, centerY);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Draw audio-reactive particles along spiral
  for (let i = 0; i < data.length; i += 4) {
    const v = data[i] / 255;
    if (v > 0.1) {
      const angle = (i / data.length) * Math.PI * 6 + time * 2;
      const radius = 10 + (i / data.length) * maxRadius + v * 30;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const colorIndex = Math.floor((i / data.length) * colors.length);
      const particleSize = v * 3 + 1;
      
      // Particle glow
      const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, particleSize * 2);
      particleGradient.addColorStop(0, colors[colorIndex] + 'FF');
      particleGradient.addColorStop(1, colors[colorIndex] + '00');
      
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(x, y, particleSize * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function renderRings(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array, colors: string[]) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 20;
  const time = Date.now() * 0.001;
  
  for (let ring = 0; ring < 6; ring++) {
    const ringData = data.slice(ring * (data.length / 6), (ring + 1) * (data.length / 6));
    const avgIntensity = ringData.reduce((sum, val) => sum + val, 0) / ringData.length / 255;
    const baseRadius = 15 + ring * 25;
    const radius = baseRadius + avgIntensity * 25;
    
    const colorIndex = ring % colors.length;
    const ringOpacity = 0.3 + avgIntensity * 0.7;
    
    // Create ring gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, baseRadius, centerX, centerY, radius);
    gradient.addColorStop(0, colors[colorIndex] + '00');
    gradient.addColorStop(0.7, colors[colorIndex] + Math.floor(ringOpacity * 255).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, colors[colorIndex] + '00');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3 + avgIntensity * 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Add rotating segments for more dynamic effect
    if (avgIntensity > 0.2) {
      const segments = 8;
      for (let segment = 0; segment < segments; segment++) {
        const segmentAngle = (segment / segments) * Math.PI * 2 + time * (ring + 1);
        const segmentLength = avgIntensity * 15;
        
        ctx.strokeStyle = colors[colorIndex] + '80';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(segmentAngle) * radius,
          centerY + Math.sin(segmentAngle) * radius
        );
        ctx.lineTo(
          centerX + Math.cos(segmentAngle) * (radius + segmentLength),
          centerY + Math.sin(segmentAngle) * (radius + segmentLength)
        );
        ctx.stroke();
      }
    }
  }
}

function renderTunnel(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array, colors: string[]) {
  const centerX = width / 2;
  const centerY = height / 2;
  const time = Date.now() * 0.001;
  const maxDepth = Math.min(width, height) / 2;
  
  // Draw tunnel rings
  for (let ring = 0; ring < 8; ring++) {
    const ringData = data.slice(ring * (data.length / 8), (ring + 1) * (data.length / 8));
    const avgIntensity = ringData.reduce((sum, val) => sum + val, 0) / ringData.length / 255;
    const depth = (ring / 8) * maxDepth + avgIntensity * 20;
    const ringRadius = depth * 0.8;
    const ringOpacity = 1 - (ring / 8) + avgIntensity * 0.3;
    
    const colorIndex = ring % colors.length;
    
    // Draw ring segments
    const segments = 16;
    for (let segment = 0; segment < segments; segment++) {
      const angle = (segment / segments) * Math.PI * 2 + time * 0.5;
      const x1 = centerX + Math.cos(angle) * ringRadius;
      const y1 = centerY + Math.sin(angle) * ringRadius;
      const x2 = centerX + Math.cos(angle + 0.1) * ringRadius;
      const y2 = centerY + Math.sin(angle + 0.1) * ringRadius;
      
      ctx.strokeStyle = colors[colorIndex] + Math.floor(ringOpacity * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
  
  // Draw tunnel particles
  for (let i = 0; i < data.length; i += 3) {
    const v = data[i] / 255;
    if (v > 0.1) {
      const angle = (i / data.length) * Math.PI * 2 + time;
      const depth = v * maxDepth;
      const x = centerX + Math.cos(angle) * depth;
      const y = centerY + Math.sin(angle) * depth;
      const size = (1 - v) * 3 + 1;
      
      const colorIndex = Math.floor((i / data.length) * colors.length);
      
      // Particle with depth-based glow
      const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      particleGradient.addColorStop(0, colors[colorIndex] + 'FF');
      particleGradient.addColorStop(0.5, colors[colorIndex] + '80');
      particleGradient.addColorStop(1, colors[colorIndex] + '00');
      
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function renderGalaxy(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array, colors: string[]) {
  const centerX = width / 2;
  const centerY = height / 2;
  const time = Date.now() * 0.001;
  const maxRadius = Math.min(width, height) / 2 - 20;
  
  // Draw galaxy core
  const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
  coreGradient.addColorStop(0, colors[0] + 'FF');
  coreGradient.addColorStop(0.7, colors[0] + '80');
  coreGradient.addColorStop(1, colors[0] + '00');
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
  ctx.fill();
  
  // Galaxy arms with spiral structure
  for (let arm = 0; arm < 3; arm++) {
    const armAngle = arm * (Math.PI * 2 / 3);
    
    for (let i = 0; i < data.length; i += 4) {
      const v = data[i] / 255;
      if (v > 0.05) {
        const spiralAngle = (i / data.length) * Math.PI * 4 + armAngle + time * 0.3;
        const radius = 30 + (i / data.length) * maxRadius * 0.8;
        const spiralRadius = radius + Math.sin(spiralAngle * 2) * 20;
        const x = centerX + Math.cos(spiralAngle) * spiralRadius;
        const y = centerY + Math.sin(spiralAngle) * spiralRadius;
        
        const colorIndex = arm % colors.length;
        const particleSize = v * 2 + 0.5;
        
        // Create star with glow
        const starGradient = ctx.createRadialGradient(x, y, 0, x, y, particleSize * 3);
        starGradient.addColorStop(0, colors[colorIndex] + 'FF');
        starGradient.addColorStop(0.5, colors[colorIndex] + '80');
        starGradient.addColorStop(1, colors[colorIndex] + '00');
        
        ctx.fillStyle = starGradient;
        ctx.beginPath();
        ctx.arc(x, y, particleSize * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core star
        ctx.fillStyle = colors[colorIndex];
        ctx.beginPath();
        ctx.arc(x, y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  // Add nebula clouds
  for (let cloud = 0; cloud < 3; cloud++) {
    const cloudAngle = (cloud / 3) * Math.PI * 2 + time * 0.1;
    const cloudRadius = 60 + cloud * 40;
    const cloudX = centerX + Math.cos(cloudAngle) * cloudRadius;
    const cloudY = centerY + Math.sin(cloudAngle) * cloudRadius;
    
    const cloudGradient = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, 40);
    cloudGradient.addColorStop(0, colors[cloud % colors.length] + '40');
    cloudGradient.addColorStop(1, colors[cloud % colors.length] + '00');
    
    ctx.fillStyle = cloudGradient;
    ctx.beginPath();
    ctx.arc(cloudX, cloudY, 40, 0, Math.PI * 2);
    ctx.fill();
  }
}


