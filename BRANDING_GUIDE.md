# EarGoo Branding Guide

This document outlines the consistent branding used throughout the EarGoo project.

## 🎵 Brand Identity

### Product Name
- **Primary**: EarGoo
- **Tagline**: Professional Audio Visualization
- **Description**: Professional-grade audio visualizer with real-time frequency analysis, multiple visualization modes, and high-quality video export capabilities

### Brand Elements

#### Typography
- **Primary Font**: System fonts (sans-serif)
- **Display Font**: For headings and titles
- **Code Font**: Monospace for technical content

#### Colors
- **Primary**: #7aa2f7 (Blue)
- **Secondary**: #bb9af7 (Purple)
- **Success**: #9ece6a (Green)
- **Warning**: #e0af68 (Orange)
- **Error**: #f7768e (Red)
- **Background**: #0a0f1c (Dark Blue)
- **Surface**: #1a1f2e (Dark Gray)

#### Logo
- **Text**: "EarGoo" in gradient blue-to-purple
- **Icon**: Audio waveform or musical note (future)
- **Usage**: Always with proper spacing and contrast

## 📁 File Naming Conventions

### Repository
- **GitHub**: `eargoo`
- **Package**: `eargoo`
- **Docker**: `eargoo`

### Configuration
- **Environment**: `NEXT_PUBLIC_APP_NAME=EarGoo`
- **Window Object**: `window.EarGooConfig`
- **Local Storage**: `eargoo_*` (e.g., `eargoo_control_panel_width`)

## 🎯 Brand Usage Guidelines

### In Code
```javascript
// Configuration
app: {
    name: 'EarGoo',
    version: '0.1.0',
    description: 'Professional Audio Visualization Studio'
}

// Local Storage
localStorage.setItem('eargoo_custom_presets', data);

// Window Object
window.EarGooConfig = config;
```

### In Documentation
- **README**: "🎵 EarGoo"
- **Titles**: "EarGoo - Professional Audio Visualization"
- **Headers**: "EarGoo Setup", "EarGoo Configuration"
- **Links**: "eargoo" in URLs and paths

### In User Interface
- **Page Title**: "EarGoo - Professional Audio Visualization"
- **Main Heading**: "EarGoo"
- **Watermark**: "EarGoo - Free Tier"
- **Footer**: "EarGoo v2.0"

## 🔧 Configuration Files

### package.json
```json
{
  "name": "eargoo",
  "description": "A professional web-based audio visualizer...",
  "author": {
    "name": "EarGoo Contributors"
  }
}
```

### config.js
```javascript
app: {
    name: 'EarGoo',
    version: '0.1.0',
    description: 'Professional Audio Visualization Studio'
}
```

### Environment Variables
```bash
NEXT_PUBLIC_APP_NAME=EarGoo
NEXT_PUBLIC_APP_VERSION=0.1.0
```

## 📝 Content Guidelines

### Tone and Voice
- **Professional** but approachable
- **Technical** but accessible
- **Innovative** and cutting-edge
- **Community-focused** for open source

### Messaging
- **Primary**: "Professional Audio Visualization"
- **Secondary**: "Real-time frequency analysis"
- **Features**: "Multiple visualization modes"
- **Quality**: "High-quality video export"

### Open Source Messaging
- **Freedom**: "No limits, no watermarks"
- **Privacy**: "Local processing, your data stays private"
- **Community**: "Built with ❤️ by EarGoo"
- **Accessibility**: "Works out of the box"

## 🚀 Deployment Branding

### GitHub Pages
- **Repository**: `eargoo`
- **URL**: `https://username.github.io/eargoo`
- **Title**: "EarGoo - Professional Audio Visualization"

### Docker
- **Image**: `eargoo`
- **Container**: `eargoo`
- **Service**: `eargoo`

### Domain Names
- **Primary**: `eargoo.com` (future)
- **Development**: `eargoo.local`
- **Staging**: `staging.eargoo.com`

## 🎨 Visual Identity

### CSS Variables
```css
:root {
    --brand-primary: #7aa2f7;
    --brand-secondary: #bb9af7;
    --brand-gradient: linear-gradient(135deg, #7aa2f7 0%, #bb9af7 100%);
}
```

### Gradients
- **Primary**: Blue to Purple (`#7aa2f7` to `#bb9af7`)
- **Secondary**: Purple to Pink (`#bb9af7` to `#f093fb`)
- **Accent**: Green to Blue (`#9ece6a` to `#7aa2f7`)

### Icons and Graphics
- **Audio Waveform**: Primary visual element
- **Frequency Bars**: Core visualization
- **Color Themes**: Neon, Ocean, Sunset, Forest, Cyberpunk, Monochrome

## 📋 Brand Checklist

### Before Release
- [ ] All "Audio Visualizer" references changed to "EarGoo"
- [ ] Package name is "eargoo"
- [ ] Repository name is "eargoo"
- [ ] Configuration uses "EarGoo"
- [ ] Documentation uses consistent branding
- [ ] UI elements display "EarGoo"
- [ ] Local storage uses "eargoo_" prefix
- [ ] Environment variables use "EarGoo"

### For Contributors
- [ ] Use "EarGoo" in commit messages
- [ ] Reference "EarGoo" in documentation
- [ ] Follow color scheme guidelines
- [ ] Maintain consistent typography
- [ ] Use proper brand messaging

## 🌟 Brand Evolution

### Current (v0.1.0)
- **Focus**: Open source audio visualization
- **Message**: "Professional Audio Visualization - Now Open Source"
- **Audience**: Developers, creators, audio enthusiasts

### Future (v2.0+)
- **Focus**: Cloud hosting and enterprise features
- **Message**: "Professional Audio Visualization Platform"
- **Audience**: Teams, enterprises, professional creators

---

*EarGoo - Professional Audio Visualization* 🎵
