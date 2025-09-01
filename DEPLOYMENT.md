# Deployment Guide

This guide covers deploying Audio Visualizer to various hosting platforms, from simple static hosting to full cloud deployments.

## Table of Contents

- [Quick Start](#quick-start)
- [Static Hosting](#static-hosting)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [GitHub Pages](#github-pages)
- [Cloudflare Pages](#cloudflare-pages)
- [AWS S3 + CloudFront](#aws-s3--cloudfront)
- [Docker Deployment](#docker-deployment)
- [Self-Hosted](#self-hosted)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites

- Git repository with your Audio Visualizer code
- Node.js 16+ (for build processes)
- Modern web browser for testing

### Basic Static Deployment

1. **Clone and setup:**
   ```bash
   git clone https://github.com/your-username/audio-visualizer.git
   cd audio-visualizer
   ```

2. **Configure environment:**
   ```bash
   cp env.example.json env.json
   # Edit env.json with your settings
   ```

3. **Test locally:**
   ```bash
   npm run serve
   # Open http://localhost:8000
   ```

4. **Deploy to your preferred platform (see sections below)**

## Static Hosting

### Option 1: Simple HTTP Server

**Best for:** Local development, testing, simple demos

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx live-server --port=8000

# PHP
php -S localhost:8000
```

### Option 2: Nginx

**Best for:** Production servers, high performance

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/audio-visualizer;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Vercel Deployment

**Best for:** Next.js applications, automatic deployments, serverless functions

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Configure Project

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "name": "audio-visualizer",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "NEXT_PUBLIC_APP_NAME": "Audio Visualizer",
    "NEXT_PUBLIC_APP_VERSION": "0.1.0"
  }
}
```

### 3. Deploy

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

### 4. Environment Variables

In Vercel dashboard or via CLI:

```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add ENABLE_ANALYTICS production
```

## Netlify Deployment

**Best for:** Static sites, form handling, serverless functions

### 1. Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub/GitLab/Bitbucket repository

### 2. Configure Build Settings

**Build command:** `echo "Static site - no build needed"`
**Publish directory:** `.`
**Base directory:** (leave empty)

### 3. Environment Variables

In Netlify dashboard → Site settings → Environment variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
ENABLE_ANALYTICS=false
ENABLE_ERROR_TRACKING=false
```

### 4. Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records

## GitHub Pages

**Best for:** Open source projects, documentation sites

### 1. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` (or your default branch)
4. Folder: `/ (root)`

### 2. Configure for SPA

Create `.nojekyll` file in root to bypass Jekyll processing.

### 3. Update Base URL

If deploying to `https://username.github.io/repo-name`, update your base URL in `env.json`:

```json
{
  "NEXT_PUBLIC_BASE_URL": "https://username.github.io/repo-name"
}
```

### 4. Deploy

```bash
# Push to main branch
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## Cloudflare Pages

**Best for:** Global CDN, edge computing, DDoS protection

### 1. Connect Repository

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create new project
3. Connect your Git repository

### 2. Build Configuration

**Framework preset:** None
**Build command:** (leave empty)
**Build output directory:** `.`
**Root directory:** (leave empty)

### 3. Environment Variables

In project settings → Environment variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=production
```

### 4. Custom Domain

1. Go to Custom domains
2. Add your domain
3. Update DNS records

## AWS S3 + CloudFront

**Best for:** Enterprise, high traffic, custom infrastructure

### 1. Create S3 Bucket

```bash
aws s3 mb s3://your-audio-visualizer-bucket
aws s3 website s3://your-audio-visualizer-bucket --index-document index.html --error-document index.html
```

### 2. Upload Files

```bash
aws s3 sync . s3://your-audio-visualizer-bucket --exclude "node_modules/*" --exclude ".git/*" --exclude "*.md"
```

### 3. Configure CloudFront

1. Create CloudFront distribution
2. Origin: S3 bucket
3. Behaviors: Cache based on selected request headers
4. Error pages: Return 200 for 404 errors (for SPA routing)

### 4. Environment Variables

Since S3 is static, use `env.json` for configuration:

```json
{
  "SUPABASE_URL": "https://your-project.supabase.co",
  "SUPABASE_ANON_KEY": "your-anon-key-here"
}
```

## Docker Deployment

**Best for:** Containerized deployments, microservices

### 1. Create Dockerfile

```dockerfile
FROM nginx:alpine

# Copy application files
COPY . /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Create nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### 3. Build and Run

```bash
# Build image
docker build -t audio-visualizer .

# Run container
docker run -p 80:80 audio-visualizer
```

### 4. Docker Compose

```yaml
version: '3.8'
services:
  audio-visualizer:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## Self-Hosted

### Option 1: Traditional Web Server

**Requirements:**
- Web server (Apache, Nginx, IIS)
- SSL certificate
- Domain name

**Steps:**
1. Upload files to web server
2. Configure web server for SPA routing
3. Set up SSL certificate
4. Configure environment variables

### Option 2: Node.js Server

Create `server.js`:

```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Install dependencies and run:

```bash
npm install express
node server.js
```

## Environment Configuration

### Development

```bash
# Copy example file
cp env.example.json env.json

# Edit with your settings
nano env.json
```

### Production

**Option 1: Environment Variables**
```bash
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_ANON_KEY=your-anon-key-here
```

**Option 2: env.json File**
```json
{
  "SUPABASE_URL": "https://your-project.supabase.co",
  "SUPABASE_ANON_KEY": "your-anon-key-here",
  "ENABLE_ANALYTICS": "false",
  "ENABLE_ERROR_TRACKING": "false"
}
```

**Option 3: Build-time Injection**
```bash
# Replace placeholders during build
sed -i 's/your-supabase-url/https:\/\/your-project.supabase.co/g' env.json
```

### Security Considerations

1. **Never commit sensitive data** to version control
2. **Use environment variables** for production secrets
3. **Enable HTTPS** for all production deployments
4. **Set appropriate CORS headers** if needed
5. **Use CSP headers** for security

## Troubleshooting

### Common Issues

**1. CORS Errors**
```
Access to fetch at 'https://api.example.com' from origin 'https://yourdomain.com' has been blocked by CORS policy
```

**Solution:** Configure CORS in your API or use a proxy.

**2. 404 Errors on Refresh**
```
GET /dashboard 404 (Not Found)
```

**Solution:** Configure web server for SPA routing (see nginx.conf examples above).

**3. Environment Variables Not Loading**
```
Configuration not found
```

**Solution:** Check file paths and environment variable names.

**4. Audio Context Issues**
```
AudioContext was not allowed to start
```

**Solution:** Ensure HTTPS is enabled and user interaction has occurred.

### Performance Optimization

1. **Enable gzip compression**
2. **Set appropriate cache headers**
3. **Use CDN for static assets**
4. **Optimize images and audio files**
5. **Minify JavaScript and CSS**

### Monitoring

1. **Set up error tracking** (Sentry, LogRocket)
2. **Monitor performance** (Web Vitals, Core Web Vitals)
3. **Track user analytics** (Google Analytics, Plausible)
4. **Set up uptime monitoring** (UptimeRobot, Pingdom)

---

For more help, check the [main README](../README.md) or create an issue on GitHub.
