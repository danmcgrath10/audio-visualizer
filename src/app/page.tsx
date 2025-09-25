import Uploader from "../components/uploader";
import MicInput from "../components/mic-input";
import VisualizerCanvas from "../components/visualizer-canvas";
import ControlPanel from "../components/control-panel";
import StatusIndicator from "../components/status-indicator";
import DragDropOverlay from "../components/drag-drop-overlay";
// import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts";

export default function Home() {
  // useKeyboardShortcuts();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            EarGoo
          </h1>
          <p className="text-xl text-slate-300">
            Real-time audio visualization with Web Audio API
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Load Audio File</h2>
            <p className="text-slate-300 mb-4">
              Upload an audio file to visualize its frequency spectrum in real-time.
            </p>
            <Uploader />
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Use Microphone</h2>
            <p className="text-slate-300 mb-4">
              Use your microphone for real-time audio visualization and analysis.
            </p>
            <MicInput />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-center">Visualizer Canvas</h3>
            <VisualizerCanvas />
          </div>
          
          <div className="space-y-6">
            <ControlPanel />
            <StatusIndicator />
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
            <div>• Real-time frequency analysis</div>
            <div>• Multiple visualization modes</div>
            <div>• Drag & drop support</div>
          </div>
        </div>
      </div>
      
      <DragDropOverlay />
    </div>
  )
}