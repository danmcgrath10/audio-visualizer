#!/usr/bin/env node

/**
 * Audio Visualizer Setup Script
 * 
 * This script helps users quickly set up the Audio Visualizer project
 * for development or production use.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function createEnvFile() {
  const envPath = path.join(process.cwd(), 'env.json');
  
  if (fs.existsSync(envPath)) {
    log('⚠️  env.json already exists. Skipping creation.', 'yellow');
    return;
  }

  const defaultConfig = {
    "SUPABASE_URL": "https://your-project.supabase.co",
    "SUPABASE_ANON_KEY": "your-anon-key-here",
    "ENABLE_ANALYTICS": "false",
    "ENABLE_ERROR_TRACKING": "false",
    "ENABLE_MIDI_SUPPORT": "true",
    "ENABLE_VIDEO_EXPORT": "true",
    "ENABLE_CLOUD_FEATURES": "false",
    "NEXT_PUBLIC_APP_NAME": "Audio Visualizer",
    "NEXT_PUBLIC_APP_VERSION": "0.1.0",
    "NEXT_PUBLIC_DEFAULT_THEME": "neon",
    "NEXT_PUBLIC_DEFAULT_FFT_SIZE": "512",
    "NEXT_PUBLIC_DEFAULT_SMOOTHING": "0.6",
    "NEXT_PUBLIC_DEFAULT_SENSITIVITY": "1.0",
    "NEXT_PUBLIC_BASE_URL": "http://localhost:8000",
    "NEXT_PUBLIC_DEBUG": "true"
  };

  fs.writeFileSync(envPath, JSON.stringify(defaultConfig, null, 2));
  log('✅ Created env.json with default configuration', 'green');
}

function checkDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    log('❌ package.json not found. Please run this script from the project root.', 'red');
    process.exit(1);
  }

  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    log('📦 Installing dependencies...', 'blue');
    const { execSync } = require('child_process');
    try {
      execSync('npm install', { stdio: 'inherit' });
      log('✅ Dependencies installed successfully', 'green');
    } catch (error) {
      log('❌ Failed to install dependencies. Please run "npm install" manually.', 'red');
      process.exit(1);
    }
  } else {
    log('✅ Dependencies already installed', 'green');
  }
}

function createNojekyllFile() {
  const nojekyllPath = path.join(process.cwd(), '.nojekyll');
  
  if (!fs.existsSync(nojekyllPath)) {
    fs.writeFileSync(nojekyllPath, '');
    log('✅ Created .nojekyll file for GitHub Pages', 'green');
  }
}

async function setupSupabase() {
  log('\n🔧 Supabase Setup (Optional)', 'cyan');
  log('Supabase is optional for basic functionality. The visualizer works perfectly without it!', 'yellow');
  
  const useSupabase = await question('Do you want to set up Supabase for cloud features? (y/N): ');
  
  if (useSupabase.toLowerCase() === 'y' || useSupabase.toLowerCase() === 'yes') {
    log('\n📋 Supabase Setup Instructions:', 'blue');
    log('1. Go to https://supabase.com and create a new project', 'reset');
    log('2. Note your project URL and anon key', 'reset');
    log('3. Run the SQL script in supabase-setup.sql in your Supabase SQL editor', 'reset');
    log('4. Update env.json with your Supabase credentials', 'reset');
    log('5. Set ENABLE_CLOUD_FEATURES to "true" in env.json', 'reset');
    
    const envPath = path.join(process.cwd(), 'env.json');
    if (fs.existsSync(envPath)) {
      const envConfig = JSON.parse(fs.readFileSync(envPath, 'utf8'));
      envConfig.ENABLE_CLOUD_FEATURES = "true";
      fs.writeFileSync(envPath, JSON.stringify(envConfig, null, 2));
      log('✅ Updated env.json to enable cloud features', 'green');
    }
  } else {
    log('✅ Skipping Supabase setup. Using basic mode.', 'green');
  }
}

function showNextSteps() {
  log('\n🎉 Setup Complete!', 'green');
  log('\n📋 Next Steps:', 'blue');
  log('1. Start the development server:', 'reset');
  log('   npm run serve', 'cyan');
  log('   or', 'reset');
  log('   npm run dev (for Next.js version)', 'cyan');
  
  log('\n2. Open your browser to:', 'reset');
  log('   http://localhost:8000 (static version)', 'cyan');
  log('   http://localhost:3000 (Next.js version)', 'cyan');
  
  log('\n3. Load an audio file or use your microphone to start visualizing!', 'reset');
  
  log('\n📚 Additional Resources:', 'blue');
  log('• README.md - Complete documentation', 'reset');
  log('• CONTRIBUTING.md - How to contribute', 'reset');
  log('• DEPLOYMENT.md - Deployment guides', 'reset');
  
  log('\n🚀 Ready to deploy? Check DEPLOYMENT.md for platform-specific instructions.', 'magenta');
}

async function main() {
  log('🎵 Audio Visualizer Setup', 'bright');
  log('========================', 'bright');
  
  try {
    // Check if we're in the right directory
    const indexPath = path.join(process.cwd(), 'index.html');
    if (!fs.existsSync(indexPath)) {
      log('❌ index.html not found. Please run this script from the project root.', 'red');
      process.exit(1);
    }
    
    log('\n🔍 Checking project structure...', 'blue');
    
    // Check and install dependencies
    checkDependencies();
    
    // Create environment file
    createEnvFile();
    
    // Create .nojekyll for GitHub Pages
    createNojekyllFile();
    
    // Setup Supabase (optional)
    await setupSupabase();
    
    // Show next steps
    showNextSteps();
    
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { main, createEnvFile, checkDependencies };
