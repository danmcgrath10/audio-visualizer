// Environment Variable Injector for Static Hosting
// This script can be used to inject environment variables at build time

function injectEnvironmentVariables() {
    // Create a global env object that can be accessed by config.js
    window.env = {
        SUPABASE_URL: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'your-anon-key-here',
        ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS || 'false',
        ENABLE_ERROR_TRACKING: process.env.ENABLE_ERROR_TRACKING || 'false',
        GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || null,
        SENTRY_DSN: process.env.SENTRY_DSN || null
    };
}

// For Node.js environments (build time)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { injectEnvironmentVariables };
}

// For browser environments (runtime)
if (typeof window !== 'undefined') {
    // Try to inject from any available source
    try {
        // Check if process.env is available (unlikely in browser)
        if (typeof process !== 'undefined' && process.env) {
            window.env = {
                SUPABASE_URL: process.env.SUPABASE_URL,
                SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
                ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
                ENABLE_ERROR_TRACKING: process.env.ENABLE_ERROR_TRACKING,
                GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
                SENTRY_DSN: process.env.SENTRY_DSN
            };
        }
    } catch (e) {
        console.log('Environment variables not available in browser context');
    }
}

// Alternative: Load from a JSON file
function loadEnvFromFile() {
    fetch('/env.json')
        .then(response => response.json())
        .then(data => {
            window.env = data;
            console.log('Environment variables loaded from env.json');
        })
        .catch(error => {
            console.log('No env.json file found, using defaults');
        });
}

// Auto-load if in browser
if (typeof window !== 'undefined') {
    loadEnvFromFile();
}
