// Enhanced Audio Visualizer with Improved Controls
class AudioVisualizer {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentScene = 'bars';
        
        // Audio playback elements
        this.audioElement = null;
        this.audioFile = null;
        this.audioDuration = 0;
        this.currentTime = 0;
        
        // Video recording properties
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.recordingProgress = 0;
        
        // Animation properties
        this.time = 0;
        this.bassHistory = [];
        this.midHistory = [];
        this.trebleHistory = [];
        
        // Space visualization properties
        this.stars = [];
        this.nebulae = [];
        this.meteors = [];
        this.initializeSpaceElements();
        
        // Advanced settings
        this.settings = {
            fftSize: 512,
            smoothing: 0.6,
            sensitivity: 1.0,
            colorTheme: 'neon',
            videoResolution: '1080x1920',
            videoQuality: 'medium',
            frameRate: 30
        };
        
        // Color themes
        this.colorThemes = {
            neon: ['#7aa2f7', '#bb9af7', '#7dcfb6', '#e0af68'],
            ocean: ['#4facfe', '#00f2fe', '#43e97b', '#3eadcf'],
            sunset: ['#fa709a', '#fee140', '#ffa726', '#ff6b6b'],
            forest: ['#11998e', '#38ef7d', '#a8e6cf', '#69bf7e'],
            cyberpunk: ['#f093fb', '#f5576c', '#4facfe', '#bd5eff'],
            monochrome: ['#ffffff', '#9ca3af', '#6b7280', '#374151']
        };
        
        // Audio analysis
        this.bpmDetector = {
            peaks: [],
            intervals: [],
            bpm: 0,
            confidence: 0
        };
        
        // Presets
        this.presets = {
            'social-media': {
                scene: 'bars',
                theme: 'neon',
                resolution: '1080x1920',
                sensitivity: 1.2
            },
            'music-video': {
                scene: 'galaxy',
                theme: 'cyberpunk',
                resolution: '1920x1080',
                sensitivity: 1.5
            },
            'podcast': {
                scene: 'waveform',
                theme: 'ocean',
                resolution: '1280x720',
                sensitivity: 0.8
            },
            'gaming': {
                scene: 'space',
                theme: 'cyberpunk',
                resolution: '1920x1080',
                sensitivity: 2.0
            }
        };
        
        this.setupCanvas();
        this.setupEventListeners();
        this.setupAdvancedControls();
        this.clearCanvas();
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    setupEventListeners() {
        // File loading
        document.getElementById('loadBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.loadAudioFile(file);
        });

        // Microphone
        document.getElementById('micBtn').addEventListener('click', () => {
            this.startMicrophone();
        });

        // Playback controls
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.togglePlayPause();
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartAudio();
        });

        document.getElementById('stopBtn').addEventListener('click', () => {
            this.stopAudio();
        });

        // Video controls
        document.getElementById('downloadVideoBtn').addEventListener('click', () => {
            this.createVideo();
        });

        document.getElementById('downloadCompleteBtn').addEventListener('click', () => {
            this.downloadVideo();
        });

        document.getElementById('newVideoBtn').addEventListener('click', () => {
            this.resetForNewVideo();
        });

        // Enhanced Drag & drop
        const dragOverlay = document.getElementById('dragOverlay');
        let dragCounter = 0;

        document.addEventListener('dragenter', (e) => {
            e.preventDefault();
            dragCounter++;
            if (dragCounter === 1) {
                dragOverlay.classList.add('active');
            }
        });

        document.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dragCounter--;
            if (dragCounter === 0) {
                dragOverlay.classList.remove('active');
            }
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            dragCounter = 0;
            dragOverlay.classList.remove('active');
            
            const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('audio/'));
            if (file) {
                this.loadAudioFile(file);
            } else {
                this.showError('Please drop a valid audio file (MP3, WAV, M4A, FLAC)');
            }
        });

        // Drop zone click
        document.getElementById('dropZone').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    if (this.audioElement) this.togglePlayPause();
                    break;
                case 'KeyR':
                    e.preventDefault();
                    if (this.audioElement) this.restartAudio();
                    break;
                case 'KeyS':
                    e.preventDefault();
                    if (this.audioElement) this.stopAudio();
                    break;
                case 'KeyV':
                    e.preventDefault();
                    if (this.audioFile) this.createVideo();
                    break;
                case 'Digit1': this.setScene('bars'); break;
                case 'Digit2': this.setScene('radial'); break;
                case 'Digit3': this.setScene('waveform'); break;
                case 'Digit4': this.setScene('particles'); break;
                case 'Digit5': this.setScene('spiral'); break;
                case 'Digit6': this.setScene('rings'); break;
                case 'Digit7': this.setScene('tunnel'); break;
                case 'Digit8': this.setScene('galaxy'); break;
                case 'Digit9': this.setScene('space'); break;
            }
        });

        // Scene selection
        document.querySelectorAll('.scene-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setScene(e.target.dataset.scene);
            });
        });
    }

    setupAdvancedControls() {
        // Audio settings
        document.getElementById('fftSize').addEventListener('change', (e) => {
            this.settings.fftSize = parseInt(e.target.value);
            this.updateAudioSettings();
        });

        document.getElementById('smoothing').addEventListener('input', (e) => {
            this.settings.smoothing = parseFloat(e.target.value);
            document.getElementById('smoothingValue').textContent = e.target.value;
            this.updateAudioSettings();
        });

        document.getElementById('sensitivity').addEventListener('input', (e) => {
            this.settings.sensitivity = parseFloat(e.target.value);
            document.getElementById('sensitivityValue').textContent = e.target.value;
        });

        // Color themes
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setColorTheme(e.currentTarget.dataset.theme);
            });
        });

        // Export settings
        document.getElementById('videoResolution').addEventListener('change', (e) => {
            this.settings.videoResolution = e.target.value;
        });

        document.getElementById('videoQuality').addEventListener('change', (e) => {
            this.settings.videoQuality = e.target.value;
        });

        document.getElementById('frameRate').addEventListener('change', (e) => {
            this.settings.frameRate = parseInt(e.target.value);
        });

        // Presets
        document.getElementById('presetSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadPreset(e.target.value);
            }
        });

        document.getElementById('savePreset').addEventListener('click', () => {
            this.saveCustomPreset();
        });

        document.getElementById('loadPreset').addEventListener('click', () => {
            this.loadCustomPreset();
        });
    }

    updateAudioSettings() {
        if (this.analyser) {
            this.analyser.fftSize = this.settings.fftSize;
            this.analyser.smoothingTimeConstant = this.settings.smoothing;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        }
    }

    setColorTheme(themeName) {
        this.settings.colorTheme = themeName;
        
        // Update UI
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === themeName) {
                btn.classList.add('active');
            }
        });
        
        this.showNotification(`Switched to ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} color theme`, 'success');
    }

    getColor(index) {
        const colors = this.colorThemes[this.settings.colorTheme];
        return colors[index % colors.length];
    }

    loadPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;

        // Apply preset settings
        this.setScene(preset.scene);
        this.setColorTheme(preset.theme);
        this.settings.videoResolution = preset.resolution;
        this.settings.sensitivity = preset.sensitivity;

        // Update UI
        document.getElementById('videoResolution').value = preset.resolution;
        document.getElementById('sensitivity').value = preset.sensitivity;
        document.getElementById('sensitivityValue').textContent = preset.sensitivity.toFixed(1);

        this.showNotification(`Loaded ${presetName.replace('-', ' ')} preset`, 'success');
    }

    saveCustomPreset() {
        const name = prompt('Enter preset name:');
        if (!name) return;

        const preset = {
            scene: this.currentScene,
            theme: this.settings.colorTheme,
            resolution: this.settings.videoResolution,
            sensitivity: this.settings.sensitivity,
            fftSize: this.settings.fftSize,
            smoothing: this.settings.smoothing
        };

        localStorage.setItem(`audiovis_preset_${name}`, JSON.stringify(preset));
        this.showNotification(`Saved preset: ${name}`, 'success');
    }

    loadCustomPreset() {
        const name = prompt('Enter preset name to load:');
        if (!name) return;

        const presetData = localStorage.getItem(`audiovis_preset_${name}`);
        if (!presetData) {
            this.showNotification(`Preset "${name}" not found`, 'error');
            return;
        }

        const preset = JSON.parse(presetData);
        
        // Apply custom preset
        this.setScene(preset.scene);
        this.setColorTheme(preset.theme);
        Object.assign(this.settings, preset);

        // Update UI
        document.getElementById('fftSize').value = preset.fftSize;
        document.getElementById('smoothing').value = preset.smoothing;
        document.getElementById('sensitivity').value = preset.sensitivity;
        document.getElementById('videoResolution').value = preset.resolution;
        document.getElementById('smoothingValue').textContent = preset.smoothing.toFixed(2);
        document.getElementById('sensitivityValue').textContent = preset.sensitivity.toFixed(1);

        this.updateAudioSettings();
        this.showNotification(`Loaded custom preset: ${name}`, 'success');
    }

    async initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.settings.fftSize;
            this.analyser.smoothingTimeConstant = this.settings.smoothing;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            return true;
        } catch (error) {
            this.showError('Failed to initialize audio: ' + error.message);
            return false;
        }
    }

    async loadAudioFile(file) {
        try {
            // Reset previous state
            this.stopAudio();
            
            if (!this.audioContext && !(await this.initAudioContext())) return;

            // Store file
            this.audioFile = file;
            
            // Create audio element for playback control
            this.audioElement = new Audio();
            this.audioElement.src = URL.createObjectURL(file);
            this.audioElement.crossOrigin = 'anonymous';
            
            // Wait for metadata to load
            await new Promise((resolve, reject) => {
                this.audioElement.addEventListener('loadedmetadata', resolve);
                this.audioElement.addEventListener('error', reject);
            });
            
            this.audioDuration = this.audioElement.duration;
            
            // Set up audio context source
            if (this.source) this.source.disconnect();
            this.source = this.audioContext.createMediaElementSource(this.audioElement);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // Set up time tracking
            this.audioElement.addEventListener('timeupdate', () => {
                this.currentTime = this.audioElement.currentTime;
            });
            
            this.audioElement.addEventListener('ended', () => {
                this.isPlaying = false;
                this.updatePlaybackUI();
            });
            
            // Start playback
            await this.audioElement.play();
            this.isPlaying = true;
            this.isPaused = false;
            
            this.updateStatus(`Playing: ${file.name}`, true);
            this.showPlaybackControls();
            this.showVideoControls();
            this.animate();
            
        } catch (error) {
            this.showError('Failed to load file: ' + error.message);
        }
    }

    async startMicrophone() {
        try {
            this.stopAudio();
            
            if (!this.audioContext && !(await this.initAudioContext())) return;

            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            if (this.source) this.source.disconnect();
            this.source = this.audioContext.createMediaStreamSource(stream);
            this.source.connect(this.analyser);
            
            this.isPlaying = true;
            this.isPaused = false;
            this.audioFile = null; // No file for microphone
            
            this.updateStatus('Microphone active', true);
            this.hidePlaybackControls(); // No playback controls for mic
            this.hideVideoControls(); // No video creation for mic
            this.animate();
            
        } catch (error) {
            this.showError('Microphone access denied: ' + error.message);
        }
    }

    togglePlayPause() {
        if (!this.audioElement) return;
        
        if (this.isPlaying && !this.isPaused) {
            this.audioElement.pause();
            this.isPlaying = false;
            this.isPaused = true;
            this.updateStatus('Paused', false);
        } else {
            this.audioElement.play();
            this.isPlaying = true;
            this.isPaused = false;
            this.updateStatus('Playing', true);
            this.animate();
        }
        this.updatePlaybackUI();
    }

    restartAudio() {
        if (!this.audioElement) return;
        
        this.audioElement.currentTime = 0;
        this.currentTime = 0;
        
        if (!this.isPlaying || this.isPaused) {
            this.audioElement.play();
            this.isPlaying = true;
            this.isPaused = false;
            this.updateStatus('Playing', true);
            this.animate();
        }
        this.updatePlaybackUI();
    }

    stopAudio() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        
        if (this.source) {
            this.source.disconnect();
        }
        
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        
        this.updateStatus('Stopped', false);
        this.hidePlaybackControls();
        this.hideVideoControls();
        this.clearCanvas();
    }

    async createVideo() {
        if (!this.audioFile) {
            this.showError('Please load an audio file first');
            return;
        }

        try {
            // Show progress
            this.showRecordingStatus('Preparing video creation...');
            this.showProgress(0, 'Initializing...');
            
            // Set up recording mode
            document.body.classList.add('recording-mode');
            this.resizeCanvasForRecording();

            // Create dedicated audio element for recording
            const recordingAudio = new Audio();
            recordingAudio.src = URL.createObjectURL(this.audioFile);
            recordingAudio.currentTime = 0;

            // Set up recording audio context
            const recordingAudioContext = new AudioContext();
            const recordingSource = recordingAudioContext.createMediaElementSource(recordingAudio);
            const recordingAnalyser = recordingAudioContext.createAnalyser();
            const recordingDestination = recordingAudioContext.createMediaStreamDestination();
            
            recordingAnalyser.fftSize = 512;
            recordingAnalyser.smoothingTimeConstant = 0.6;
            
            recordingSource.connect(recordingAnalyser);
            recordingSource.connect(recordingDestination);
            
            // Set up recording
            const canvasStream = this.canvas.captureStream(30);
            const audioStream = recordingDestination.stream;
            
            const combinedStream = new MediaStream();
            canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
            audioStream.getAudioTracks().forEach(track => combinedStream.addTrack(track));

            this.recordedChunks = [];
            
            // Try different formats in order of preference
            let recorderOptions;
            if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264,aac')) {
                recorderOptions = { mimeType: 'video/mp4;codecs=h264,aac' };
                this.recordingFormat = 'mp4';
            } else if (MediaRecorder.isTypeSupported('video/mp4')) {
                recorderOptions = { mimeType: 'video/mp4' };
                this.recordingFormat = 'mp4';
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264,opus')) {
                recorderOptions = { mimeType: 'video/webm;codecs=h264,opus' };
                this.recordingFormat = 'webm';
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
                recorderOptions = { mimeType: 'video/webm;codecs=vp9,opus' };
                this.recordingFormat = 'webm';
            } else {
                recorderOptions = { mimeType: 'video/webm' };
                this.recordingFormat = 'webm';
            }
            
            this.mediaRecorder = new MediaRecorder(combinedStream, recorderOptions);
            
            // Log the format being used
            console.log(`Recording format: ${this.recordingFormat.toUpperCase()} (${recorderOptions.mimeType})`);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.processRecording();
            };

            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingProgress = 0;
            
            // Start audio playback
            recordingAudio.play();
            
            // Set up visualization
            const recordingDataArray = new Uint8Array(recordingAnalyser.frequencyBinCount);
            this.time = 0;
            
            const updateProgress = () => {
                const progress = (recordingAudio.currentTime / this.audioDuration) * 100;
                this.showProgress(progress, `Recording: ${Math.floor(recordingAudio.currentTime)}s / ${Math.floor(this.audioDuration)}s`);
            };

            const recordingAnimate = () => {
                if (recordingAudio.ended || recordingAudio.paused) {
                    this.mediaRecorder.stop();
                    this.isRecording = false;
                    return;
                }
                
                recordingAnalyser.getByteFrequencyData(recordingDataArray);
                this.renderFrame(recordingDataArray);
                this.time += 0.016;
                
                updateProgress();
                requestAnimationFrame(recordingAnimate);
            };
            
            this.showRecordingStatus('Recording video...');
            recordingAnimate();

        } catch (error) {
            this.showError('Failed to create video: ' + error.message);
            this.hideRecordingStatus();
            this.hideProgress();
            document.body.classList.remove('recording-mode');
            this.setupCanvas();
        }
    }

    async processRecording() {
        this.showRecordingStatus('Processing video...');
        this.showProgress(100, 'Finalizing...');
        
        try {
            // Create blob with the format that was recorded
            const mimeType = this.recordingFormat === 'mp4' ? 'video/mp4' : 'video/webm';
            this.recordingBlob = new Blob(this.recordedChunks, { type: mimeType });
            this.recordingUrl = URL.createObjectURL(this.recordingBlob);
            
            // Update UI
            document.getElementById('downloadVideoBtn').style.display = 'none';
            document.getElementById('downloadCompleteBtn').style.display = 'inline-block';
            document.getElementById('newVideoBtn').style.display = 'inline-block';
            
            const format = this.recordingFormat.toUpperCase();
            this.showRecordingStatus(`${format} video ready for download!`, true);
            
            // Reset canvas
            document.body.classList.remove('recording-mode');
            this.setupCanvas();
            
            setTimeout(() => {
                this.hideRecordingStatus();
                this.hideProgress();
            }, 3000);
            
        } catch (error) {
            this.showError('Failed to process video: ' + error.message);
            this.hideRecordingStatus();
            this.hideProgress();
        }
    }



    downloadVideo() {
        if (this.recordingBlob) {
            const timestamp = new Date().toISOString().slice(0, 10);
            const sceneName = this.currentScene.charAt(0).toUpperCase() + this.currentScene.slice(1);
            const extension = this.recordingFormat || 'webm';
            const filename = `audio-visualizer-${sceneName}-${timestamp}.${extension}`;
            
            const a = document.createElement('a');
            a.href = this.recordingUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    resetForNewVideo() {
        // Reset video creation state
        document.getElementById('downloadVideoBtn').style.display = 'inline-block';
        document.getElementById('downloadCompleteBtn').style.display = 'none';
        document.getElementById('newVideoBtn').style.display = 'none';
        
        // Clear previous recording
        if (this.recordingUrl) {
            URL.revokeObjectURL(this.recordingUrl);
            this.recordingUrl = null;
            this.recordingBlob = null;
        }
        
        this.hideRecordingStatus();
        this.hideProgress();
    }

    // UI Helper methods
    showPlaybackControls() {
        document.getElementById('playbackControls').classList.add('active');
        this.updatePlaybackUI();
    }

    hidePlaybackControls() {
        document.getElementById('playbackControls').classList.remove('active');
    }

    showVideoControls() {
        document.getElementById('videoControls').classList.add('active');
        this.resetForNewVideo(); // Reset to initial state
    }

    hideVideoControls() {
        document.getElementById('videoControls').classList.remove('active');
    }

    updatePlaybackUI() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (this.isPlaying && !this.isPaused) {
            playPauseBtn.textContent = '⏸️ Pause';
        } else {
            playPauseBtn.textContent = '▶️ Play';
        }
    }

    showRecordingStatus(message, success = false) {
        const status = document.getElementById('recordingStatus');
        status.textContent = message;
        status.classList.add('active');
        if (success) {
            status.classList.add('success');
        } else {
            status.classList.remove('success');
        }
    }

    hideRecordingStatus() {
        const status = document.getElementById('recordingStatus');
        status.classList.remove('active', 'success');
    }

    showProgress(percent, text) {
        document.getElementById('progressContainer').classList.add('active');
        document.getElementById('progressBar').style.width = percent + '%';
        document.getElementById('progressText').textContent = text;
    }

    hideProgress() {
        document.getElementById('progressContainer').classList.remove('active');
    }

    resizeCanvasForRecording() {
        const [width, height] = this.settings.videoResolution.split('x').map(Number);
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }

    // Rest of the visualization methods (keeping existing ones)
    renderFrame(dataArray) {
        this.clearCanvas();
        
        const bass = this.getFrequencyBand(dataArray, 0, 10) * this.settings.sensitivity;
        const mid = this.getFrequencyBand(dataArray, 10, 80) * this.settings.sensitivity;
        const treble = this.getFrequencyBand(dataArray, 80, dataArray.length) * this.settings.sensitivity;
        
        this.bassHistory.push(bass);
        this.midHistory.push(mid);
        this.trebleHistory.push(treble);
        
        if (this.bassHistory.length > 60) {
            this.bassHistory.shift();
            this.midHistory.shift();
            this.trebleHistory.shift();
        }
        
        // Update real-time analysis UI
        this.updateAnalysisDisplay(bass, mid, treble);
        
        // Apply sensitivity to data array
        const sensitiveDataArray = dataArray.map(val => Math.min(255, val * this.settings.sensitivity));
        
        switch (this.currentScene) {
            case 'bars': this.drawBars(sensitiveDataArray); break;
            case 'radial': this.drawRadial(sensitiveDataArray); break;
            case 'waveform': this.drawWaveform(); break;
            case 'particles': this.drawParticles(sensitiveDataArray); break;
            case 'spiral': this.drawSpiral(sensitiveDataArray); break;
            case 'rings': this.drawRings(sensitiveDataArray); break;
            case 'tunnel': this.drawTunnel(sensitiveDataArray); break;
            case 'galaxy': this.drawGalaxy(sensitiveDataArray); break;
            case 'space': this.drawSpace(sensitiveDataArray); break;
        }
    }

    updateAnalysisDisplay(bass, mid, treble) {
        // Update frequency meters
        document.getElementById('bassLevel').style.width = Math.min(100, bass * 100) + '%';
        document.getElementById('midLevel').style.width = Math.min(100, mid * 100) + '%';
        document.getElementById('highLevel').style.width = Math.min(100, treble * 100) + '%';
        
        // Simple BPM detection (basic implementation)
        if (bass > 0.7) {
            const now = Date.now();
            this.bpmDetector.peaks.push(now);
            
            // Keep only recent peaks (last 10 seconds)
            this.bpmDetector.peaks = this.bpmDetector.peaks.filter(peak => now - peak < 10000);
            
            if (this.bpmDetector.peaks.length > 4) {
                const intervals = [];
                for (let i = 1; i < this.bpmDetector.peaks.length; i++) {
                    intervals.push(this.bpmDetector.peaks[i] - this.bpmDetector.peaks[i-1]);
                }
                
                const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
                const bpm = Math.round(60000 / avgInterval);
                
                if (bpm > 60 && bpm < 200) {
                    this.bpmDetector.bpm = bpm;
                    document.getElementById('bpmValue').textContent = bpm;
                }
            }
        }
    }

    getFrequencyBand(dataArray, start, end) {
        let sum = 0;
        for (let i = start; i < Math.min(end, dataArray.length); i++) {
            sum += dataArray[i];
        }
        return sum / (end - start) / 255;
    }

    animate() {
        if (!this.isPlaying || this.isPaused || this.isRecording || !this.analyser) return;
        requestAnimationFrame(() => this.animate());
        
        this.analyser.getByteFrequencyData(this.dataArray);
        this.renderFrame(this.dataArray);
        this.time += 0.016;
    }

    // All existing draw methods go here (keeping them exactly the same)
    drawBars(dataArray) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const barWidth = width / dataArray.length * 2.5;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * height * 0.85;
            const colorIndex = Math.floor((i / dataArray.length) * 4);
            const color = this.getColor(colorIndex);
            
            const gradient = this.ctx.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, color + '66');
            gradient.addColorStop(1, color);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
            x += barWidth;
        }
    }

    drawRadial(dataArray) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 4;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.time * 0.5);

        for (let i = 0; i < dataArray.length; i++) {
            const value = dataArray[i] / 255;
            const angle = (i / dataArray.length) * Math.PI * 2;
            const lineLength = radius + value * radius * 1.5;
            
            const colorIndex = Math.floor((i / dataArray.length) * 4);
            this.ctx.strokeStyle = this.getColor(colorIndex);
            this.ctx.lineWidth = 3;
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(Math.cos(angle) * lineLength, Math.sin(angle) * lineLength);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    drawSpiral(dataArray) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        for (let i = 0; i < dataArray.length; i++) {
            const value = dataArray[i] / 255;
            const angle = (i / dataArray.length) * Math.PI * 8 + this.time;
            const radius = (i / dataArray.length) * Math.min(width, height) / 2;
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const size = value * 12 + 2;
            
            const hue = (i / dataArray.length) * 360 + this.time * 100;
            this.ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    drawRings(dataArray) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) / 2;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        for (let i = 0; i < dataArray.length / 4; i++) {
            const value = dataArray[i * 4] / 255;
            const radius = (i / (dataArray.length / 4)) * maxRadius;
            const thickness = value * 20 + 2;
            
            const hue = (i / (dataArray.length / 4)) * 360 + this.time * 20;
            this.ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
            this.ctx.lineWidth = thickness;
            
            this.ctx.beginPath();
            this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    drawTunnel(dataArray) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        const segments = 20;
        for (let i = 0; i < segments; i++) {
            const progress = i / segments;
            const dataIndex = Math.floor(progress * dataArray.length);
            const value = dataArray[dataIndex] / 255;
            
            const z = progress + this.time * 0.1;
            const scale = 1 / (z + 0.1);
            const radius = (100 + value * 200) * scale;
            
            const hue = progress * 360 + this.time * 50;
            const alpha = Math.max(0, 1 - progress);
            
            this.ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
            this.ctx.lineWidth = 4 * scale;
            
            this.ctx.beginPath();
            this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    drawGalaxy(dataArray) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.time * 0.1);

        for (let arm = 0; arm < 3; arm++) {
            for (let i = 0; i < dataArray.length; i++) {
                const value = dataArray[i] / 255;
                const angle = (i / dataArray.length) * Math.PI * 4 + (arm * Math.PI * 2 / 3);
                const radius = (i / dataArray.length) * Math.min(width, height) / 2;
                
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const size = value * 8 + 1;
                
                const hue = (i / dataArray.length) * 60 + arm * 120 + this.time * 30;
                const alpha = value * 0.8 + 0.2;
                
                this.ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        this.ctx.restore();
    }

    drawWaveform() {
        if (!this.analyser) return;
        
        const timeData = new Uint8Array(this.analyser.fftSize);
        this.analyser.getByteTimeDomainData(timeData);
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.strokeStyle = this.getColor(0);
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        const sliceWidth = width / timeData.length;
        let x = 0;
        
        for (let i = 0; i < timeData.length; i++) {
            const v = timeData[i] / 128.0;
            const y = v * height / 2;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        this.ctx.stroke();
    }

    drawParticles(dataArray) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let i = 0; i < dataArray.length; i++) {
            const value = dataArray[i] / 255;
            const angle = (i / dataArray.length) * Math.PI * 2 + this.time * 0.5;
            const distance = value * Math.min(width, height) / 2.5;
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const size = value * 12 + 2;
            
            const hue = (i / dataArray.length) * 360 + this.time * 100;
            this.ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Space visualization methods (keeping all existing space methods)
    initializeSpaceElements() {
        this.stars = [];
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * 360,
                y: Math.random() * 640,
                z: Math.random() * 1000,
                speed: Math.random() * 2 + 0.5,
                brightness: Math.random(),
                twinkle: Math.random() * Math.PI * 2
            });
        }
        
        this.nebulae = [];
        for (let i = 0; i < 8; i++) {
            this.nebulae.push({
                x: Math.random() * 360,
                y: Math.random() * 640,
                z: Math.random() * 500 + 200,
                size: Math.random() * 100 + 50,
                hue: Math.random() * 360,
                alpha: Math.random() * 0.3 + 0.1,
                drift: Math.random() * 0.5 + 0.2
            });
        }
        
        this.meteors = [];
    }

    drawSpace(dataArray) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        const gradient = this.ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
        gradient.addColorStop(0, 'rgba(25, 25, 60, 0.9)');
        gradient.addColorStop(0.5, 'rgba(15, 15, 40, 0.95)');
        gradient.addColorStop(1, 'rgba(5, 5, 20, 1)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
        
        const totalEnergy = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length / 255;
        const bassEnergy = this.getFrequencyBand(dataArray, 0, 10);
        const midEnergy = this.getFrequencyBand(dataArray, 10, 80);
        const highEnergy = this.getFrequencyBand(dataArray, 80, dataArray.length);
        
        this.drawNebulae(midEnergy, totalEnergy);
        this.drawDriftingStars(highEnergy, totalEnergy);
        this.drawCosmicDust(dataArray);
        
        if (bassEnergy > 0.7 && Math.random() < 0.1) {
            this.spawnMeteor();
        }
        
        this.drawMeteors();
        this.drawCosmicObjects(dataArray);
        
        if (totalEnergy > 0.6) {
            this.drawWarpEffect(totalEnergy);
        }
    }

    drawDriftingStars(highEnergy, totalEnergy) {
        for (let star of this.stars) {
            star.z -= star.speed * (1 + totalEnergy * 3);
            
            if (star.z <= 0) {
                star.z = 1000;
                star.x = Math.random() * 360;
                star.y = Math.random() * 640;
            }
            
            const scale = 200 / star.z;
            const x = (star.x - 180) * scale + 180;
            const y = (star.y - 320) * scale + 320;
            
            const size = scale * 2 + highEnergy * 3;
            const brightness = (star.brightness * scale + highEnergy) * 0.8;
            
            star.twinkle += 0.1;
            const twinkle = Math.sin(star.twinkle) * 0.3 + 0.7;
            
            const alpha = Math.min(1, brightness * twinkle);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (brightness > 0.5) {
                this.ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.3})`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    drawNebulae(midEnergy, totalEnergy) {
        for (let nebula of this.nebulae) {
            nebula.z -= nebula.drift;
            if (nebula.z <= 0) {
                nebula.z = 500;
                nebula.x = Math.random() * 360;
                nebula.y = Math.random() * 640;
            }
            
            const scale = 200 / nebula.z;
            const x = (nebula.x - 180) * scale + 180;
            const y = (nebula.y - 320) * scale + 320;
            const size = nebula.size * scale * (1 + midEnergy);
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
            const hue = (nebula.hue + this.time * 10) % 360;
            const alpha = nebula.alpha * scale * (0.5 + midEnergy * 0.5);
            
            gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, ${alpha})`);
            gradient.addColorStop(0.3, `hsla(${hue + 30}, 70%, 50%, ${alpha * 0.7})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawCosmicDust(dataArray) {
        for (let i = 0; i < dataArray.length; i += 4) {
            const value = dataArray[i] / 255;
            if (value < 0.1) continue;
            
            const angle = (i / dataArray.length) * Math.PI * 2 + this.time * 0.1;
            const distance = 50 + (i / dataArray.length) * 250;
            const x = 180 + Math.cos(angle) * distance;
            const y = 320 + Math.sin(angle) * distance * 0.6;
            
            const size = value * 2;
            const hue = (i / dataArray.length) * 360 + this.time * 20;
            const alpha = value * 0.6;
            
            this.ctx.fillStyle = `hsla(${hue}, 60%, 70%, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    spawnMeteor() {
        this.meteors.push({
            x: Math.random() * 360,
            y: -20,
            speedX: (Math.random() - 0.5) * 4,
            speedY: Math.random() * 8 + 5,
            length: Math.random() * 40 + 20,
            brightness: Math.random() * 0.8 + 0.2,
            life: 1.0
        });
    }

    drawMeteors() {
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            
            meteor.x += meteor.speedX;
            meteor.y += meteor.speedY;
            meteor.life -= 0.01;
            
            if (meteor.y > 660 || meteor.life <= 0) {
                this.meteors.splice(i, 1);
                continue;
            }
            
            const gradient = this.ctx.createLinearGradient(
                meteor.x, meteor.y,
                meteor.x - meteor.speedX * meteor.length * 0.1,
                meteor.y - meteor.speedY * meteor.length * 0.1
            );
            
            const alpha = meteor.brightness * meteor.life;
            gradient.addColorStop(0, `rgba(255, 255, 200, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(255, 150, 100, ${alpha * 0.7})`);
            gradient.addColorStop(1, 'rgba(255, 100, 100, 0)');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(meteor.x, meteor.y);
            this.ctx.lineTo(
                meteor.x - meteor.speedX * meteor.length * 0.1,
                meteor.y - meteor.speedY * meteor.length * 0.1
            );
            this.ctx.stroke();
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(meteor.x, meteor.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawCosmicObjects(dataArray) {
        const bassEnergy = this.getFrequencyBand(dataArray, 0, 10);
        
        const planet1X = 50;
        const planet1Y = 150;
        const planet1Size = 25 + bassEnergy * 15;
        
        const planetGradient = this.ctx.createRadialGradient(
            planet1X, planet1Y, 0,
            planet1X, planet1Y, planet1Size
        );
        planetGradient.addColorStop(0, `hsla(30, 80%, 60%, 0.8)`);
        planetGradient.addColorStop(0.7, `hsla(20, 70%, 40%, 0.6)`);
        planetGradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        
        this.ctx.fillStyle = planetGradient;
        this.ctx.beginPath();
        this.ctx.arc(planet1X, planet1Y, planet1Size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = `rgba(200, 180, 100, ${0.3 + bassEnergy * 0.4})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(planet1X, planet1Y, planet1Size * 1.8, planet1Size * 0.3, 0, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawWarpEffect(totalEnergy) {
        const centerX = 180;
        const centerY = 320;
        
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 100 + i * 20;
            
            const x1 = centerX + Math.cos(angle) * distance;
            const y1 = centerY + Math.sin(angle) * distance;
            const x2 = centerX + Math.cos(angle) * (distance + totalEnergy * 50);
            const y2 = centerY + Math.sin(angle) * (distance + totalEnergy * 50);
            
            const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1, `rgba(255, 255, 255, ${totalEnergy * 0.6})`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    clearCanvas() {
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateStatus(text, active) {
        document.getElementById('statusText').textContent = text;
        const dot = document.getElementById('statusDot');
        if (active) dot.classList.add('active');
        else dot.classList.remove('active');
    }

    setScene(sceneName) {
        this.currentScene = sceneName;
        document.querySelectorAll('.scene-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.scene === sceneName) {
                btn.classList.add('active');
            }
        });
        
        // Show brief notification
        this.showNotification(`Switched to ${sceneName.charAt(0).toUpperCase() + sceneName.slice(1)} visualization`, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('errorContainer');
        const text = document.getElementById('errorText');
        
        text.textContent = message;
        container.className = `notification ${type} show`;
        
        setTimeout(() => {
            container.classList.remove('show');
            setTimeout(() => {
                container.classList.add('hidden');
                container.className = 'notification hidden';
            }, 400);
        }, type === 'error' ? 5000 : 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AudioVisualizer();
});
