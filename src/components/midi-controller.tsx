"use client";

import { useState, useEffect } from "react";
import { useAudioStore } from "../store/audio-store";

interface MIDIDevice {
  id: string;
  name: string;
  manufacturer: string;
  state: string;
}

export default function MIDIController() {
  const [devices, setDevices] = useState<MIDIDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setSensitivity,
    setSmoothing,
    setVisualizationMode,
    setColorTheme,
  } = useAudioStore();

  const scanDevices = async () => {
    try {
      if (!navigator.requestMIDIAccess) {
        setError("MIDI is not supported in this browser");
        return;
      }

      const access = await navigator.requestMIDIAccess();
      const deviceList: MIDIDevice[] = [];

      access.inputs.forEach((input) => {
        deviceList.push({
          id: input.id,
          name: input.name || "Unknown Device",
          manufacturer: input.manufacturer || "Unknown",
          state: input.state,
        });
      });

      setDevices(deviceList);
      setError(null);
    } catch (err) {
      setError("Failed to access MIDI devices");
    }
  };

  const connectDevice = (deviceId: string) => {
    if (!navigator.requestMIDIAccess) return;

    navigator.requestMIDIAccess().then((access) => {
      const input = access.inputs.get(deviceId);
      if (input) {
        input.onmidimessage = (message) => {
          const [status, data1, data2] = message.data;
          
          // Handle Control Change messages
          if (status >= 176 && status <= 191) {
            const cc = data1;
            const value = data2 / 127; // Normalize to 0-1

            switch (cc) {
              case 1: // CC1 - Sensitivity
                setSensitivity(value * 3); // Map to 0-3 range
                break;
              case 2: // CC2 - Smoothing
                setSmoothing(value * 0.95); // Map to 0-0.95 range
                break;
              case 3: // CC3 - Scene Selection
                const scenes = ["bars", "radial", "waveform", "space", "spiral", "rings", "tunnel", "galaxy"];
                const sceneIndex = Math.floor(value * scenes.length);
                setVisualizationMode(scenes[sceneIndex] as any);
                break;
              case 4: // CC4 - Color Theme
                const themes = ["neon", "ocean", "sunset", "forest", "cyberpunk", "monochrome"];
                const themeIndex = Math.floor(value * themes.length);
                setColorTheme(themes[themeIndex] as any);
                break;
            }
          }
        };

        setSelectedDevice(deviceId);
        setIsConnected(true);
        setError(null);
      }
    });
  };

  const disconnectDevice = () => {
    setSelectedDevice(null);
    setIsConnected(false);
  };

  useEffect(() => {
    scanDevices();
  }, []);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-300">🎹 MIDI Controller</h4>
      
      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={scanDevices}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
        >
          🔍 Scan for Devices
        </button>

        {devices.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400">Available Devices:</div>
            {devices.map((device) => (
              <div
                key={device.id}
                className={`p-2 rounded border cursor-pointer transition-all ${
                  selectedDevice === device.id
                    ? "border-blue-500 bg-blue-900/20"
                    : "border-slate-600 hover:border-slate-500"
                }`}
                onClick={() => connectDevice(device.id)}
              >
                <div className="font-medium text-sm">{device.name}</div>
                <div className="text-xs text-slate-400">{device.manufacturer}</div>
              </div>
            ))}
          </div>
        )}

        {isConnected && (
          <div className="space-y-2">
            <div className="text-sm text-green-400">✅ MIDI Connected</div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>CC1: Sensitivity</div>
              <div>CC2: Smoothing</div>
              <div>CC3: Scene Selection</div>
              <div>CC4: Color Theme</div>
            </div>
            <button
              onClick={disconnectDevice}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
