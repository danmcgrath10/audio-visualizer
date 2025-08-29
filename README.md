# 🎵 Audio Visualizer

A modern, real-time audio visualizer built with Next.js, TypeScript, and the Web Audio API. Features multiple visualization modes, beat detection, and an intuitive user interface.

![Audio Visualizer](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-FF6B6B?style=for-the-badge)

## ✨ Features

- **Multiple Visualization Modes**: Frequency bars, radial spectrum, hybrid view, particle system, and waveform
- **Real-time Audio Analysis**: FFT-based frequency analysis with customizable parameters
- **Beat Detection**: Adaptive threshold algorithm with visual beat accents
- **Multiple Input Sources**: Load audio files or use microphone/DAW loopback
- **Dynamic Color Palettes**: Auto-switching color schemes on detected beats
- **Responsive Design**: Optimized for desktop and mobile devices
- **Drag & Drop Support**: Simply drop audio files anywhere on the interface
- **Glass Morphism UI**: Modern, intuitive interface with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd audio-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎛️ Usage

### Loading Audio

1. **File Upload**: Click "Load File" or drag & drop audio files
2. **Microphone**: Click "Microphone" for real-time input
3. **DAW Integration**: Route your DAW output to a virtual audio device, set as system mic, then use microphone mode

### Controls

- **Visualization Mode**: Switch between different visual representations
- **FFT Size**: Adjust frequency resolution (higher = more detail, more CPU)
- **Smoothing**: Control visual stability vs responsiveness
- **Volume**: Adjust output volume
- **Color Palettes**: Multiple built-in color schemes with auto-switching

### Visualization Modes

- **Frequency Bars**: Classic spectrum analyzer with vertical bars
- **Radial Spectrum**: Circular visualization with center glow effects
- **Hybrid View**: Combination of bars and radial displays
- **Particle System**: Dynamic particles responding to frequency bands
- **Waveform**: Real-time waveform with frequency overlay

## 🔧 Configuration

### Audio Settings

- **FFT Size**: 1024 - 32768 (power of 2)
- **Smoothing**: 0.0 - 0.95 (lower = more responsive)
- **Beat Sensitivity**: Adjustable threshold for beat detection

### Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/audio-visualizer)

Or deploy to any platform that supports Next.js:

```bash
npm run build
npm start
```

## 🛠️ Development

### Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── audio-controls.tsx
│   └── visualizer-canvas.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utilities and core logic
│   ├── audio-engine.ts    # Web Audio API wrapper
│   ├── visualization-renderer.ts  # Canvas rendering
│   └── utils.ts
└── types/              # TypeScript type definitions
```

### Key Technologies

- **Next.js 14**: React framework with app directory
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Web Audio API**: Real-time audio processing
- **Canvas 2D**: Hardware-accelerated rendering

### Adding New Features

The codebase is designed for extensibility. Examples:

#### Add a New Visualization Scene

```typescript
// In visualization-renderer.ts
private renderNewScene(analysis: AudioAnalysis): void {
  // Your custom visualization logic
}

// Add to the render switch statement
case 'newScene':
  this.renderNewScene(analysis)
  break
```

#### Add Custom Color Palettes

```typescript
// In visualization-renderer.ts
private palettes: ColorPalette[] = [
  // ... existing palettes
  {
    id: 'custom',
    name: 'Custom',
    colors: ['#color1', '#color2', '#color3', '#color4'],
  }
]
```

## 🎯 Performance Tips

- Use lower FFT sizes for better performance on slower devices
- Adjust smoothing for the right balance of responsiveness vs stability
- The visualizer automatically optimizes canvas resolution based on device pixel ratio

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Web Audio API documentation and community
- Next.js team for the excellent framework
- Tailwind CSS for the utility-first approach
- The open-source community for inspiration and tools
