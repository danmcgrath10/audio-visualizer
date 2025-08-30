# 🎵 EarGoo

A professional web-based audio visualizer with real-time frequency analysis, advanced visualizations, and cloud-based user management powered by Supabase.

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
- Supabase account (for backend services)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd eargoo
```

### 2. Set Up Supabase

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
2. Create a new project named "EarGoo"
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Name: "EarGoo Web"
   - Authorized origins: `http://localhost:8000`, `https://yourdomain.com`
   - Redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. Copy the Client ID to Supabase Google provider settings

### 3. Configure the Application

#### Set Up Environment Variables

**Option 1: Environment Variables (Recommended for development)**
Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

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
  "ENABLE_ERROR_TRACKING": "false"
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

### 4. Run the Application

#### Option A: Simple HTTP Server
```bash
python3 -m http.server 8000
```

#### Option B: Node.js Development Server
```bash
npm install -g live-server
live-server --port=8000
```

#### Option C: Python HTTP Server
```bash
python -m http.server 8000
```

### 5. Access the Application
Open your browser and navigate to `http://localhost:8000`

## 📁 Project Structure

```
eargoo/
├── index.html              # Main application HTML
├── visualizer.js           # Core visualization engine
├── auth.js                 # Authentication service
├── supabase-setup.sql      # Database schema and setup
├── README.md              # This file
└── backup/                # Original files (if any)
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

## 💰 Subscription Tiers

### Free Tier
- ✅ 3 videos per day
- ✅ Basic visualizations
- ✅ Watermark on exports
- ✅ 720p resolution max
- ✅ Community templates
- ❌ MIDI controller support

### Pro Tier ($9.99/month)
- ✅ Unlimited videos
- ✅ All visualizations
- ✅ No watermark
- ✅ 4K resolution
- ✅ Custom templates
- ✅ Priority support
- ✅ Advanced analytics

### Enterprise Tier ($49.99/month)
- ✅ Everything in Pro
- ✅ Team collaboration
- ✅ Custom branding
- ✅ API access
- ✅ Dedicated support
- ✅ Usage analytics

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

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

### Netlify Deployment
1. Connect your GitHub repository
2. Set build command: `echo "Static site"`
3. Set publish directory: `.`

### Custom Domain
1. Configure DNS records
2. Update Supabase site URL
3. Set up SSL certificate

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

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Standards
- Use ES6+ features
- Follow consistent naming
- Add comments for complex logic
- Test across browsers

### Testing
- Audio functionality
- Video export
- Authentication flow
- Mobile responsiveness
- Performance benchmarks

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

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

**Built with ❤️ by EarGoo using Web Audio API, Canvas 2D, and Supabase**
