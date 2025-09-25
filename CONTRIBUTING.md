# Contributing to EarGoo

Thank you for your interest in contributing to EarGoo! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Feature Requests](#feature-requests)
- [Bug Reports](#bug-reports)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 16+ 
- Modern web browser with Web Audio API support
- Git
- Basic knowledge of JavaScript, HTML, and CSS

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/eargoo.git
   cd eargoo
   ```
  3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/eargoo.git
   ```

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```bash
# Supabase Configuration (optional for local development)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_ERROR_TRACKING=false
```

### 3. Start Development Server

For Next.js development:
```bash
npm run dev
```

For static file development:
```bash
npm run serve
# or
npm run serve-node
```

### 4. Access the Application

Open your browser and navigate to:
- Next.js: `http://localhost:3000`
- Static: `http://localhost:8000`

## Making Changes

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Follow the [Code Style](#code-style) guidelines
- Write clear, descriptive commit messages
- Test your changes thoroughly

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat: add new visualization mode"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Testing

### Manual Testing

1. Test audio file upload functionality
2. Test microphone input
3. Test all visualization modes
4. Test video export (if implemented)
5. Test responsive design on different screen sizes
6. Test browser compatibility

### Automated Testing

Run the test suite:
```bash
npm test
```

### Browser Testing

Test in the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Submitting Changes

### 1. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill out the pull request template
5. Submit the pull request

### 3. Pull Request Guidelines

- Provide a clear description of the changes
- Include screenshots for UI changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed

## Code Style

### JavaScript/TypeScript

- Use ES6+ features
- Prefer `const` and `let` over `var`
- Use arrow functions where appropriate
- Use template literals for string interpolation
- Use destructuring for object/array access
- Use async/await over Promises

### HTML

- Use semantic HTML elements
- Include proper ARIA attributes for accessibility
- Use lowercase for attributes
- Quote all attribute values

### CSS

- Use Tailwind CSS classes when possible
- Follow BEM methodology for custom CSS
- Use CSS custom properties for theming
- Ensure responsive design

### File Naming

- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for variables and functions

## Feature Requests

### Before Submitting

1. Check if the feature already exists
2. Search existing issues for similar requests
3. Consider if the feature aligns with project goals

### Submitting a Feature Request

1. Use the "Feature Request" issue template
2. Provide a clear description of the feature
3. Explain the use case and benefits
4. Include mockups or examples if applicable

## Bug Reports

### Before Submitting

1. Check if the bug has already been reported
2. Try to reproduce the bug consistently
3. Check if it's a browser-specific issue

### Submitting a Bug Report

1. Use the "Bug Report" issue template
2. Provide steps to reproduce the bug
3. Include browser and OS information
4. Add screenshots or videos if helpful
5. Describe expected vs actual behavior

## Project Structure

```
audio-visualizer/
├── src/                    # Next.js source files
│   └── app/               # App router components
├── index.html             # Main HTML file
├── visualizer.js          # Core visualization engine
├── auth.js                # Authentication service
├── config.js              # Configuration
├── supabase-setup.sql     # Database schema
├── README.md              # Project documentation
├── CONTRIBUTING.md        # This file
├── CODE_OF_CONDUCT.md     # Community guidelines
└── LICENSE                # MIT License
```

## Getting Help

- Check the [README.md](README.md) for setup instructions
- Search existing [issues](../../issues) for similar problems
- Create a new issue if your problem isn't already reported
- Join our community discussions

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- GitHub contributors page

Thank you for contributing to EarGoo! 🎵
