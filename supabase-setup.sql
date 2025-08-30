-- Supabase Database Setup for EarGoo
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'unpaid');
CREATE TYPE project_visibility AS ENUM ('private', 'public', 'shared');

-- User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    tier subscription_tier DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}',
    usage_stats JSONB DEFAULT '{}'
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    tier subscription_tier NOT NULL,
    status subscription_status DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    settings JSONB NOT NULL DEFAULT '{}',
    audio_file_url TEXT,
    thumbnail_url TEXT,
    visibility project_visibility DEFAULT 'private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Shares Table (for shared projects)
CREATE TABLE IF NOT EXISTS project_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    shared_with UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    permission_level TEXT DEFAULT 'view', -- 'view', 'edit', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, shared_with)
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Tracking Table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    videos_created INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0, -- in seconds
    storage_used BIGINT DEFAULT 0, -- in bytes
    api_calls INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Templates Table (for preset visualizations)
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    settings JSONB NOT NULL,
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_date ON usage_tracking(user_id, date);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates(is_public);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view shared projects" ON projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM project_shares 
            WHERE project_id = projects.id 
            AND shared_with = auth.uid()
        )
    );

CREATE POLICY "Users can view public projects" ON projects
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Project shares policies
CREATE POLICY "Users can view project shares" ON project_shares
    FOR SELECT USING (
        auth.uid() = shared_by OR 
        auth.uid() = shared_with OR
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_shares.project_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can manage shares" ON project_shares
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_shares.project_id 
            AND user_id = auth.uid()
        )
    );

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON usage_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON usage_tracking
    FOR UPDATE USING (auth.uid() = user_id);

-- Templates policies
CREATE POLICY "Anyone can view public templates" ON templates
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own templates" ON templates
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own templates" ON templates
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates" ON templates
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own templates" ON templates
    FOR DELETE USING (auth.uid() = created_by);

-- Functions for common operations

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, tier)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'tier', 'free')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
    tier subscription_tier,
    status subscription_status,
    current_period_end TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.tier, s.status, s.current_period_end
    FROM subscriptions s
    WHERE s.user_id = user_uuid
    AND s.status = 'active'
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can create video (based on tier limits)
CREATE OR REPLACE FUNCTION can_create_video(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_tier subscription_tier;
    videos_today INTEGER;
    tier_limit INTEGER;
BEGIN
    -- Get user's tier
    SELECT tier INTO user_tier
    FROM profiles
    WHERE id = user_uuid;
    
    -- Get videos created today
    SELECT COALESCE(videos_created, 0) INTO videos_today
    FROM usage_tracking
    WHERE user_id = user_uuid AND date = CURRENT_DATE;
    
    -- Set limits based on tier
    CASE user_tier
        WHEN 'free' THEN tier_limit := 3;
        WHEN 'pro' THEN tier_limit := 50;
        WHEN 'enterprise' THEN tier_limit := 1000;
        ELSE tier_limit := 3;
    END CASE;
    
    RETURN videos_today < tier_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage tracking
CREATE OR REPLACE FUNCTION increment_usage(
    user_uuid UUID,
    videos_created INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    storage_bytes BIGINT DEFAULT 0,
    api_calls INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO usage_tracking (user_id, date, videos_created, total_duration, storage_used, api_calls)
    VALUES (user_uuid, CURRENT_DATE, videos_created, duration_seconds, storage_bytes, api_calls)
    ON CONFLICT (user_id, date)
    DO UPDATE SET
        videos_created = usage_tracking.videos_created + EXCLUDED.videos_created,
        total_duration = usage_tracking.total_duration + EXCLUDED.total_duration,
        storage_used = usage_tracking.storage_used + EXCLUDED.storage_used,
        api_calls = usage_tracking.api_calls + EXCLUDED.api_calls;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some default public templates
INSERT INTO templates (name, description, category, settings, is_public) VALUES
('Neon Night', 'Vibrant neon colors for electronic music', 'electronic', 
 '{"scene": "bars", "theme": "neon", "fftSize": 13, "smoothing": 0.8}', true),
('Ocean Waves', 'Calming blue tones for ambient music', 'ambient',
 '{"scene": "waveform", "theme": "ocean", "fftSize": 11, "smoothing": 0.9}', true),
('Sunset Rock', 'Warm colors for rock and indie music', 'rock',
 '{"scene": "radial", "theme": "sunset", "fftSize": 12, "smoothing": 0.6}', true),
('Cyberpunk', 'Futuristic theme for synthwave and EDM', 'electronic',
 '{"scene": "space", "theme": "cyberpunk", "fftSize": 13, "smoothing": 0.7}', true),
('Classical Elegance', 'Sophisticated theme for classical music', 'classical',
 '{"scene": "waveform", "theme": "monochrome", "fftSize": 14, "smoothing": 0.7}', true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
