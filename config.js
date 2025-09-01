// Configuration for Audio Visualizer
// This file handles configuration for both development and production environments

const config = {
    // Supabase Configuration (Optional - for cloud features)
    supabase: {
        url: (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL) || 
             (typeof window !== 'undefined' && window.env && window.env.SUPABASE_URL) ||
             'https://your-project.supabase.co',
        anonKey: (typeof process !== 'undefined' && process.env && process.env.SUPABASE_ANON_KEY) || 
                (typeof window !== 'undefined' && window.env && window.env.SUPABASE_ANON_KEY) ||
                'your-anon-key-here'
    },

    // App Configuration
    app: {
        name: (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_APP_NAME) ||
              (typeof window !== 'undefined' && window.env && window.env.NEXT_PUBLIC_APP_NAME) ||
              'Audio Visualizer',
        version: (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_APP_VERSION) ||
                (typeof window !== 'undefined' && window.env && window.env.NEXT_PUBLIC_APP_VERSION) ||
                '0.1.0',
        description: 'Professional Audio Visualization Studio - Open Source',
        baseUrl: (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_BASE_URL) ||
                (typeof window !== 'undefined' && window.env && window.env.NEXT_PUBLIC_BASE_URL) ||
                'http://localhost:8000'
    },

    // Feature Flags - Control which features are enabled
    features: {
        // Core features (always enabled)
        audioVisualization: true,
        fileUpload: true,
        microphoneInput: true,
        
        // Optional features (can be disabled)
        analytics: (typeof process !== 'undefined' && process.env && process.env.ENABLE_ANALYTICS === 'true') || 
                  (typeof window !== 'undefined' && window.env && window.env.ENABLE_ANALYTICS === 'true') || 
                  false,
        errorTracking: (typeof process !== 'undefined' && process.env && process.env.ENABLE_ERROR_TRACKING === 'true') || 
                      (typeof window !== 'undefined' && window.env && window.env.ENABLE_ERROR_TRACKING === 'true') || 
                      false,
        midiSupport: (typeof process !== 'undefined' && process.env && process.env.ENABLE_MIDI_SUPPORT !== 'false') || 
                    (typeof window !== 'undefined' && window.env && window.env.ENABLE_MIDI_SUPPORT !== 'false') || 
                    true,
        videoExport: (typeof process !== 'undefined' && process.env && process.env.ENABLE_VIDEO_EXPORT !== 'false') || 
                    (typeof window !== 'undefined' && window.env && window.env.ENABLE_VIDEO_EXPORT !== 'false') || 
                    true,
        cloudFeatures: (typeof process !== 'undefined' && process.env && process.env.ENABLE_CLOUD_FEATURES === 'true') || 
                      (typeof window !== 'undefined' && window.env && window.env.ENABLE_CLOUD_FEATURES === 'true') || 
                      false
    },

    // Analytics Configuration
    analytics: {
        googleAnalyticsId: (typeof process !== 'undefined' && process.env && process.env.GOOGLE_ANALYTICS_ID) || 
                          (typeof window !== 'undefined' && window.env && window.env.GOOGLE_ANALYTICS_ID) || 
                          null,
        sentryDsn: (typeof process !== 'undefined' && process.env && process.env.SENTRY_DSN) || 
                  (typeof window !== 'undefined' && window.env && window.env.SENTRY_DSN) || 
                  null
    },

    // Default Settings
    defaults: {
        theme: (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_DEFAULT_THEME) ||
               (typeof window !== 'undefined' && window.env && window.env.NEXT_PUBLIC_DEFAULT_THEME) ||
               'neon',
        fftSize: parseInt((typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_DEFAULT_FFT_SIZE) ||
                         (typeof window !== 'undefined' && window.env && window.env.NEXT_PUBLIC_DEFAULT_FFT_SIZE) ||
                         '512'),
        smoothing: parseFloat((typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_DEFAULT_SMOOTHING) ||
                             (typeof window !== 'undefined' && window.env && window.env.NEXT_PUBLIC_DEFAULT_SMOOTHING) ||
                             '0.6'),
        sensitivity: parseFloat((typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_DEFAULT_SENSITIVITY) ||
                               (typeof window !== 'undefined' && window.env && window.env.NEXT_PUBLIC_DEFAULT_SENSITIVITY) ||
                               '1.0')
    },

    // Subscription Tiers (for future cloud hosting)
    tiers: {
        free: {
            maxVideosPerDay: 3,
            maxResolution: '720p',
            watermark: true,
            features: ['basic-visualizations', 'community-templates'],
            price: 0
        },
        pro: {
            maxVideosPerDay: -1, // unlimited
            maxResolution: '4K',
            watermark: false,
            features: ['all-visualizations', 'midi-support', 'custom-templates', 'priority-support'],
            price: 9.99
        },
        enterprise: {
            maxVideosPerDay: -1, // unlimited
            maxResolution: '4K',
            watermark: false,
            features: ['all-visualizations', 'midi-support', 'custom-templates', 'priority-support', 'team-collaboration', 'api-access'],
            price: 49.99
        }
    },

    // Development Configuration
    development: {
        debug: (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_DEBUG === 'true') ||
               (typeof window !== 'undefined' && window.env && window.env.NEXT_PUBLIC_DEBUG === 'true') ||
               false,
        logLevel: (typeof process !== 'undefined' && process.env && process.env.LOG_LEVEL) || 'info'
    }
};

// Helper function to check if a feature is enabled
config.isFeatureEnabled = function(featureName) {
    return this.features[featureName] === true;
};

// Helper function to get a configuration value with fallback
config.get = function(path, defaultValue = null) {
    const keys = path.split('.');
    let value = this;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }
    
    return value;
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else if (typeof window !== 'undefined') {
    window.AudioVisualizerConfig = config;
}

export default config;
