// Authentication Service for EarGoo
class AuthService {
    constructor() {
        // Get configuration from environment or config file
        this.config = this.getConfig();
        this.supabaseUrl = this.config.supabase.url;
        this.supabaseAnonKey = this.config.supabase.anonKey;
        
        // Initialize Supabase client
        this.supabase = null;
        this.user = null;
        this.session = null;
        
        // Auth state
        this.isAuthenticated = false;
        this.isLoading = true;
        
        // Event listeners
        this.authStateChangeCallbacks = [];
        
        this.initializeSupabase();
    }

    getConfig() {
        // Try to get config from different sources
        if (typeof window !== 'undefined' && window.EarGooConfig) {
            return window.EarGooConfig;
        }
        
        // Try to import config module
        try {
            if (typeof require !== 'undefined') {
                return require('./config.js');
            }
        } catch (e) {
            // require not available
        }
        
        // Fallback to default config
        return {
            supabase: {
                url: 'https://your-project.supabase.co',
                anonKey: 'your-anon-key-here'
            },
            app: {
                name: 'EarGoo',
                version: '0.1.0'
            },
            features: {
                analytics: false,
                errorTracking: false,
                midiSupport: true,
                videoExport: true,
                cloudFeatures: false
            }
        };
    }

    async initializeSupabase() {
        try {
            // Load Supabase from CDN if not already loaded
            if (typeof window.supabase === 'undefined') {
                await this.loadSupabaseScript();
            }
            
            this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
            
            // Set up auth state listener
            this.supabase.auth.onAuthStateChange((event, session) => {
                this.handleAuthStateChange(event, session);
            });
            
            // Get initial session
            const { data: { session } } = await this.supabase.auth.getSession();
            if (session) {
                this.handleAuthStateChange('SIGNED_IN', session);
            }
            
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            this.showError('Authentication service unavailable');
        } finally {
            this.isLoading = false;
        }
    }

    async loadSupabaseScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    handleAuthStateChange(event, session) {
        console.log('Auth state changed:', event, session);
        
        this.session = session;
        this.user = session?.user || null;
        this.isAuthenticated = !!session;
        
        // Update UI
        this.updateAuthUI();
        
        // Call registered callbacks
        this.authStateChangeCallbacks.forEach(callback => {
            callback(event, session);
        });
        
        // Handle specific events
        switch (event) {
            case 'SIGNED_IN':
                this.onSignIn(session);
                break;
            case 'SIGNED_OUT':
                this.onSignOut();
                break;
            case 'TOKEN_REFRESHED':
                this.onTokenRefresh(session);
                break;
        }
    }

    updateAuthUI() {
        const userInfo = document.getElementById('userInfo');
        const authButtons = document.getElementById('authButtons');
        const authModal = document.getElementById('authModal');
        
        if (this.isAuthenticated && this.user) {
            // Show user info
            userInfo.style.display = 'flex';
            authButtons.style.display = 'none';
            
            // Update user details
            this.updateUserDetails();
            
            // Close auth modal if open
            authModal.classList.remove('active');
            
        } else {
            // Show auth buttons
            userInfo.style.display = 'none';
            authButtons.style.display = 'flex';
        }
    }

    updateUserDetails() {
        if (!this.user) return;
        
        const userName = document.getElementById('userName');
        const userInitials = document.getElementById('userInitials');
        const tierBadge = document.getElementById('tierBadge');
        
        // Set user name
        const displayName = this.user.user_metadata?.full_name || 
                           this.user.user_metadata?.name || 
                           this.user.email?.split('@')[0] || 
                           'User';
        userName.textContent = displayName;
        
        // Set user initials
        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
        userInitials.textContent = initials;
        
        // Set tier (this would come from user profile in Supabase)
        const userTier = this.user.user_metadata?.tier || 'free';
        tierBadge.textContent = userTier.toUpperCase() + ' TIER';
        tierBadge.className = `tier-badge ${userTier}`;
    }

    // Authentication Methods
    async signUp(email, password, fullName) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        tier: 'free'
                    }
                }
            });
            
            if (error) throw error;
            
            this.showSuccess('Account created! Please check your email to verify your account.');
            return { success: true, data };
            
        } catch (error) {
            this.showError(this.getErrorMessage(error));
            return { success: false, error };
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            this.showSuccess('Welcome back!');
            return { success: true, data };
            
        } catch (error) {
            this.showError(this.getErrorMessage(error));
            return { success: false, error };
        }
    }

    async signInWithGoogle() {
        try {
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            
            if (error) throw error;
            
            return { success: true, data };
            
        } catch (error) {
            this.showError(this.getErrorMessage(error));
            return { success: false, error };
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            
            if (error) throw error;
            
            this.showSuccess('Signed out successfully');
            return { success: true };
            
        } catch (error) {
            this.showError(this.getErrorMessage(error));
            return { success: false, error };
        }
    }

    async resetPassword(email) {
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password'
            });
            
            if (error) throw error;
            
            this.showSuccess('Password reset link sent to your email');
            return { success: true };
            
        } catch (error) {
            this.showError(this.getErrorMessage(error));
            return { success: false, error };
        }
    }

    async updatePassword(newPassword) {
        try {
            const { error } = await this.supabase.auth.updateUser({
                password: newPassword
            });
            
            if (error) throw error;
            
            this.showSuccess('Password updated successfully');
            return { success: true };
            
        } catch (error) {
            this.showError(this.getErrorMessage(error));
            return { success: false, error };
        }
    }

    async updateProfile(updates) {
        try {
            const { data, error } = await this.supabase.auth.updateUser({
                data: updates
            });
            
            if (error) throw error;
            
            this.showSuccess('Profile updated successfully');
            this.updateUserDetails();
            return { success: true, data };
            
        } catch (error) {
            this.showError(this.getErrorMessage(error));
            return { success: false, error };
        }
    }

    // User Profile Management
    async getUserProfile() {
        if (!this.user) return null;
        
        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', this.user.id)
                .single();
            
            if (error) throw error;
            
            return data;
            
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    async createUserProfile(profileData) {
        if (!this.user) return null;
        
        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .insert([
                    {
                        id: this.user.id,
                        email: this.user.email,
                        full_name: this.user.user_metadata?.full_name,
                        tier: 'free',
                        ...profileData
                    }
                ])
                .select()
                .single();
            
            if (error) throw error;
            
            return data;
            
        } catch (error) {
            console.error('Error creating user profile:', error);
            return null;
        }
    }

    async updateUserProfile(updates) {
        if (!this.user) return null;
        
        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .update(updates)
                .eq('id', this.user.id)
                .select()
                .single();
            
            if (error) throw error;
            
            return data;
            
        } catch (error) {
            console.error('Error updating user profile:', error);
            return null;
        }
    }

    // Subscription Management
    async getUserSubscription() {
        if (!this.user) return null;
        
        try {
            const { data, error } = await this.supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', this.user.id)
                .single();
            
            if (error) throw error;
            
            return data;
            
        } catch (error) {
            console.error('Error fetching subscription:', error);
            return null;
        }
    }

    async upgradeToPro() {
        if (!this.user) return null;
        
        try {
            // This would integrate with Stripe in production
            const { data, error } = await this.supabase
                .from('subscriptions')
                .insert([
                    {
                        user_id: this.user.id,
                        tier: 'pro',
                        status: 'active',
                        created_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();
            
            if (error) throw error;
            
            // Update user metadata
            await this.updateProfile({ tier: 'pro' });
            
            this.showSuccess('Upgraded to Pro successfully!');
            return data;
            
        } catch (error) {
            this.showError('Failed to upgrade subscription');
            return null;
        }
    }

    // Event Handlers
    onSignIn(session) {
        console.log('User signed in:', session.user);
        this.trackEvent('user_login', { method: 'email' });
    }

    onSignOut() {
        console.log('User signed out');
        this.trackEvent('user_logout');
    }

    onTokenRefresh(session) {
        console.log('Token refreshed');
    }

    // Utility Methods
    getErrorMessage(error) {
        if (error.message) {
            return error.message;
        }
        
        switch (error.status) {
            case 400:
                return 'Invalid email or password';
            case 401:
                return 'Authentication failed';
            case 422:
                return 'Invalid email format';
            case 429:
                return 'Too many requests. Please try again later';
            default:
                return 'An error occurred. Please try again';
        }
    }

    showSuccess(message) {
        // This would integrate with your notification system
        console.log('Success:', message);
        if (window.visualizer && window.visualizer.showNotification) {
            window.visualizer.showNotification(message, 'success');
        }
    }

    showError(message) {
        // This would integrate with your notification system
        console.error('Error:', message);
        if (window.visualizer && window.visualizer.showNotification) {
            window.visualizer.showNotification(message, 'error');
        }
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking
        console.log('Analytics:', eventName, data);
        if (window.gtag) {
            window.gtag('event', eventName, data);
        }
    }

    // Event Listener Management
    onAuthStateChange(callback) {
        this.authStateChangeCallbacks.push(callback);
    }

    removeAuthStateChangeListener(callback) {
        const index = this.authStateChangeCallbacks.indexOf(callback);
        if (index > -1) {
            this.authStateChangeCallbacks.splice(index, 1);
        }
    }

    // Getters
    getCurrentUser() {
        return this.user;
    }

    getCurrentSession() {
        return this.session;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    isLoading() {
        return this.isLoading;
    }
}

// Export for use in other files
window.AuthService = AuthService;
