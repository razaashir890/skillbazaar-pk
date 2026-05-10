-- ============================================================
-- QUICK FIX: Database error saving new user
-- Run this in Supabase SQL Editor to fix the signup error
-- ============================================================

-- Step 1: Drop the old trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Create the fixed trigger function with safe enum handling
-- and explicit search_path to bypass RLS issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    user_role "Role" := 'FREELANCER';
    user_phone TEXT;
    user_name TEXT;
    raw_meta JSONB;
BEGIN
    -- Safely extract metadata (handle NULL metadata gracefully)
    raw_meta := COALESCE(NEW.raw_user_meta_data, '{}'::JSONB);

    -- Safely extract role — only cast if it matches a valid enum value
    IF raw_meta->>'role' IN ('FREELANCER', 'CLIENT', 'BOTH', 'ADMIN') THEN
        user_role := (raw_meta->>'role')::"Role";
    END IF;

    -- Safely extract phone
    user_phone := COALESCE(raw_meta->>'phone', NULL);

    -- Safely extract name (never NULL — required by profiles table)
    user_name := COALESCE(
        raw_meta->>'full_name',
        raw_meta->>'name',
        split_part(NEW.email, '@', 1),
        'User'
    );

    -- Auto-create user row
    INSERT INTO public."users" (id, email, phone, role)
    VALUES (NEW.id::text, NEW.email, user_phone, user_role)
    ON CONFLICT (id) DO NOTHING;

    -- Auto-create profile
    INSERT INTO public."profiles" (userId, name, title, bio)
    VALUES (NEW.id::text, user_name, NULL, NULL)
    ON CONFLICT (userId) DO NOTHING;

    -- Auto-create wallet
    INSERT INTO public."wallets" (userId)
    VALUES (NEW.id::text)
    ON CONFLICT (userId) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Step 3: Re-create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Add service_role bypass policies for tables used by the trigger
-- This ensures the trigger can insert even when RLS is enabled

DO $$ BEGIN
    CREATE POLICY "service_role_all_users" ON "users"
        FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "service_role_all_profiles" ON "profiles"
        FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "service_role_all_wallets" ON "wallets"
        FOR ALL TO service_role USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Done! Now signup should work without "Database error saving new user"
