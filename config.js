// Configuration for EarGoo
// This file should be updated with your actual Supabase credentials

const config = {
    // Supabase Configuration
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
        name: 'EarGoo',
        version: '2.0.0',
        description: 'Professional Audio Visualization Studio'
    },

    // Feature Flags
    features: {
        analytics: (typeof process !== 'undefined' && process.env && process.env.ENABLE_ANALYTICS === 'true') || false,
        errorTracking: (typeof process !== 'undefined' && process.env && process.env.ENABLE_ERROR_TRACKING === 'true') || false,
        midiSupport: true,
        videoExport: true
    },

    // Analytics
    analytics: {
        googleAnalyticsId: (typeof process !== 'undefined' && process.env && process.env.GOOGLE_ANALYTICS_ID) || null,
        sentryDsn: (typeof process !== 'undefined' && process.env && process.env.SENTRY_DSN) || null
    },

    // Subscription Tiers
    tiers: {
        free: {
            maxVideosPerDay: 3,
            maxResolution: '720p',
            watermark: true,
            features: ['basic-visualizations', 'community-templates']
        },
        pro: {
            maxVideosPerDay: -1, // unlimited
            maxResolution: '4K',
            watermark: false,
            features: ['all-visualizations', 'midi-support', 'custom-templates', 'priority-support']
        }
    }
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else if (typeof window !== 'undefined') {
    window.EarGooConfig = config;
}

export default config;
