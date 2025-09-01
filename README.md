# 🎵 Audio Visualizer

A professional web-based audio visualizer with real-time frequency analysis, advanced visualizations, and cloud-based user management. **Now open source!**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

## ✨ Features

### 🎨 Visualizations
- **Frequency Bars** - Classic audio spectrum visualization
- **Radial Spectrum** - Circular frequency display with beat detection
- **Waveform Analysis** - Advanced time-domain and frequency-domain analysis
- **Space Visualization** - Immersive cosmic particle system
- **Spiral & Rings** - Dynamic geometric patterns
- **Tunnel & Galaxy** - 3D-like depth effects
- **Custom Themes** - Multiple color palettes and presets

### 🔧 Advanced Features
- **Real-time Audio Analysis** - Web Audio API with configurable FFT
- **MIDI Controller Support** - Real-time parameter control
- **Video Recording** - Export visualizations as MP4 videos
- **Drag & Drop** - Easy audio file loading
- **Microphone Input** - Live audio processing
- **Keyboard Shortcuts** - Quick access to controls

### 👤 User Management
- **Authentication** - Email/password and Google OAuth
- **User Profiles** - Personalized settings and preferences
- **Project Saving** - Cloud-based project storage
- **Subscription Tiers** - Free and Pro plans
- **Usage Analytics** - Track usage and performance

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for local development)
- Modern web browser with Web Audio API support
- Supabase account (optional - for cloud features)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd eargoo
```

### 2. Set Up Supabase (Optional - for Cloud Features)

> **Note:** Supabase is optional for basic functionality. The visualizer works perfectly without it!

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key

#### Set Up Database
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the SQL script to create all tables and functions

#### Configure Authentication
1. Go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:8000`)
3. Add Google OAuth provider (optional)
4. Configure email templates

#### Google OAuth Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project named "Audio Visualizer"
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Name: "Audio Visualizer Web"
   - Authorized origins: `http://localhost:8000`, `https://yourdomain.com`
   - Redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. Copy the Client ID to Supabase Google provider settings

### 3. Configure the Application

#### Set Up Environment Variables

**Option 1: Environment Variables (Recommended for development)**
Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration (Optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_ERROR_TRACKING=false
ENABLE_CLOUD_FEATURES=false

# Optional: Analytics and Monitoring
# GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
# ENABLE_ANALYTICS=true
```

**Option 2: Static Hosting (env.json)**
Create an `env.json` file in the root directory:

```json
{
  "SUPABASE_URL": "https://your-project.supabase.co",
  "SUPABASE_ANON_KEY": "your-anon-key-here",
  "ENABLE_ANALYTICS": "false",
  "ENABLE_ERROR_TRACKING": "false",
  "ENABLE_CLOUD_FEATURES": "false"
}
```

**Option 3: Direct Config Update**
Edit `config.js` directly:

```javascript
supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key-here'
}
```

**Option 4: No Configuration (Basic Mode)**
For basic functionality without cloud features, you can run the application without any configuration!

### 4. Run the Application

#### Option A: Using npm scripts (Recommended)
```bash
npm run serve
# or
npm run serve-node
```

#### Option B: Simple HTTP Server
```bash
python3 -m http.server 8000
```

#### Option C: Node.js Development Server
```bash
npm install -g live-server
live-server --port=8000
```

#### Option D: Next.js Development (for React version)
```bash
npm run dev
```

### 5. Access the Application
Open your browser and navigate to:
- Static version: `http://localhost:8000`
- Next.js version: `http://localhost:3000`

## 📁 Project Structure

```
audio-visualizer/
├── src/                    # Next.js source files
│   └── app/               # App router components
├── index.html             # Main HTML file
├── visualizer.js          # Core visualization engine
├── auth.js                # Authentication service
├── config.js              # Configuration
├── supabase-setup.sql     # Database schema
├── env.example.json       # Environment variables template
├── README.md              # Project documentation
├── CONTRIBUTING.md        # Contributing guidelines
├── CODE_OF_CONDUCT.md     # Community guidelines
├── DEPLOYMENT.md          # Deployment guide
└── LICENSE                # MIT License
```

## 🔧 Configuration

### Audio Settings
- **FFT Size**: 512-32768 (power of 2)
- **Smoothing**: 0.0-0.95 (time constant)
- **Sensitivity**: 0.1-3.0 (amplification)

### Video Export
- **Resolution**: 720p, 1080p, 4K
- **Quality**: Low, Medium, High
- **Frame Rate**: 24, 30, 60 FPS
- **Format**: MP4 (H.264) or WebM

### MIDI Mapping
- **CC1**: Sensitivity
- **CC2**: Smoothing
- **CC3**: Scene Selection
- **CC4**: Color Theme

## 💰 Subscription Tiers (Future Cloud Hosting)

> **Note:** These tiers are planned for future cloud hosting. The open source version includes all features!

### Free Tier (Open Source)
- ✅ All visualizations
- ✅ No watermark
- ✅ 4K resolution
- ✅ Custom templates
- ✅ MIDI controller support
- ✅ Self-hosted
- ✅ No limits

### Pro Tier (Future Cloud - $9.99/month)
- ✅ Everything in Free
- ✅ Cloud hosting
- ✅ Project saving
- ✅ Team collaboration
- ✅ Priority support
- ✅ Advanced analytics

### Enterprise Tier (Future Cloud - $49.99/month)
- ✅ Everything in Pro
- ✅ Custom branding
- ✅ API access
- ✅ Dedicated support
- ✅ Usage analytics
- ✅ White-label solutions

## 🎛️ Usage

### Loading Audio
1. **File Upload**: Click "Load Audio" or drag & drop audio files
2. **Microphone**: Click "Microphone" for live input
3. **Supported Formats**: MP3, WAV, OGG, M4A, FLAC

### Creating Visualizations
1. **Select Scene**: Choose from available visualization types
2. **Adjust Settings**: Modify FFT size, smoothing, and sensitivity
3. **Choose Theme**: Select color palette or create custom
4. **Real-time Preview**: See changes instantly

### Recording Videos
1. **Configure Export**: Set resolution, quality, and format
2. **Start Recording**: Click "Create Video"
3. **Wait for Processing**: Monitor progress bar
4. **Download**: Click "Download MP4" when ready

### MIDI Control
1. **Connect Device**: Click "MIDI Setup"
2. **Select Device**: Choose from available MIDI devices
3. **Map Controls**: Use CC knobs to control parameters
4. **Real-time Control**: Adjust settings during playback

## 🔒 Security

### Authentication
- Secure email/password authentication
- Google OAuth integration
- Password reset functionality
- Session management

### Data Protection
- Row Level Security (RLS) policies
- Encrypted data transmission
- Secure file uploads
- Privacy-compliant analytics

### API Security
- JWT token authentication
- Rate limiting
- Input validation
- SQL injection prevention

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy Options

**Vercel (Recommended for Next.js):**
```bash
npm i -g vercel
vercel --prod
```

**Netlify:**
1. Connect your GitHub repository
2. Set build command: `echo "Static site"`
3. Set publish directory: `.`

**GitHub Pages:**
1. Enable GitHub Pages in repository settings
2. Deploy from main branch

**Static Hosting:**
```bash
# Upload files to any web server
# Configure for SPA routing
```

### Environment Variables
For production deployment, set these environment variables:

**Vercel:**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**Netlify:**
- Go to Site Settings > Environment Variables
- Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`

**Static Hosting:**
- Create `env.json` with your production values
- Or update `config.js` directly with production values
- Or use a build process to inject environment variables

## 🛠️ Development

### Local Development
```bash
# Start development server
python3 -m http.server 8000

# Watch for changes (optional)
npm install -g nodemon
nodemon --watch . --exec "python3 -m http.server 8000"
```

### Code Structure
- **Modular Design**: Separate concerns for audio, visuals, and auth
- **Event-Driven**: Real-time updates and user interactions
- **Responsive**: Mobile-first design approach
- **Accessible**: WCAG 2.1 compliant

### Adding New Visualizations
1. Create visualization method in `visualizer.js`
2. Add scene button to HTML
3. Update scene selection logic
4. Test with different audio types

### Custom Themes
```javascript
// Add to colorThemes object
custom: ['#color1', '#color2', '#color3', '#color4']
```

## 📊 Analytics

### User Metrics
- Video creation frequency
- Feature usage patterns
- Session duration
- Conversion rates

### Performance Metrics
- Audio processing latency
- Video export times
- Memory usage
- Error rates

### Business Metrics
- Subscription conversions
- Churn rates
- Revenue per user
- Feature adoption

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Start for Contributors

1. **Fork and clone:**
   ```bash
   git clone https://github.com/your-username/audio-visualizer.git
   cd audio-visualizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development:**
   ```bash
   npm run serve
   ```

4. **Make changes and submit a PR!**

### Code Standards
- Use ES6+ features
- Follow consistent naming conventions
- Add comments for complex logic
- Test across browsers
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

### Testing
- Audio functionality
- Video export
- Authentication flow (if enabled)
- Mobile responsiveness
- Performance benchmarks

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1: Open Source Foundation ✅
- [x] Core audio visualization engine
- [x] Multiple visualization modes
- [x] Video export functionality
- [x] MIDI controller support
- [x] Open source documentation
- [x] Community guidelines

### Phase 2: Enhanced Features 🚧
- [ ] WebGL rendering
- [ ] Custom shaders
- [ ] 3D visualizations
- [ ] AI-powered analysis
- [ ] Plugin system

### Phase 3: Cloud Hosting (Future)
- [ ] User authentication
- [ ] Project saving
- [ ] Team collaboration
- [ ] Subscription management
- [ ] API access

### Phase 4: Enterprise Features (Future)
- [ ] White-label solutions
- [ ] Custom integrations
- [ ] Advanced analytics
- [ ] Dedicated support

## 🆘 Support

### Documentation
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Supabase Docs](https://supabase.com/docs)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### Community
- GitHub Issues
- Discord Server
- Email Support

### Troubleshooting

#### Common Issues

**Audio not playing:**
- Check browser permissions
- Verify audio file format
- Ensure Web Audio API support

**Video export fails:**
- Check available memory
- Verify browser compatibility
- Try different resolution

**MIDI not connecting:**
- Check device permissions
- Verify MIDI device drivers
- Test with different browser

**Authentication errors:**
- Verify Supabase configuration
- Check network connectivity
- Clear browser cache

## 🔮 Roadmap

### Phase 1: Core Features ✅
- [x] Basic audio visualization
- [x] User authentication
- [x] Video export
- [x] MIDI support

### Phase 2: Advanced Features 🚧
- [ ] WebGL rendering
- [ ] Custom shaders
- [ ] 3D visualizations
- [ ] AI-powered analysis

### Phase 3: Collaboration
- [ ] Real-time collaboration
- [ ] Project sharing
- [ ] Team workspaces
- [ ] Version control

### Phase 4: Enterprise
- [ ] White-label solutions
- [ ] API access
- [ ] Custom integrations
- [ ] Advanced analytics

---

**Built with ❤️ by the Audio Visualizer community using Web Audio API, Canvas 2D, and modern web technologies**

## 🙏 Acknowledgments

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for audio processing
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) for rendering
- [Supabase](https://supabase.com) for backend services (optional)
- [Next.js](https://nextjs.org) for the React framework
- [Tailwind CSS](https://tailwindcss.com) for styling
- All our contributors and the open source community!
