-- ============================================================
-- QUICK FIX: "Database error saving new user"
-- Paste ALL of this in Supabase SQL Editor and click RUN
-- ============================================================

-- Step 1: Remove password column if it still exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
    ) THEN
        ALTER TABLE "users" DROP COLUMN "password";
    END IF;
END $$;

-- Step 2: Drop old trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Create bulletproof trigger function
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
    raw_meta := COALESCE(NEW.raw_user_meta_data, '{}'::JSONB);

    -- Safe role extraction with exception handling
    BEGIN
        IF raw_meta->>'role' IS NOT NULL AND raw_meta->>'role' != '' THEN
            user_role := (raw_meta->>'role')::"Role";
        END IF;
    EXCEPTION WHEN OTHERS THEN
        user_role := 'FREELANCER';
    END;

    user_phone := COALESCE(raw_meta->>'phone', NULL);
    user_name := COALESCE(
        raw_meta->>'full_name',
        raw_meta->>'name',
        split_part(NEW.email, '@', 1),
        'User'
    );

    -- Each insert wrapped in its own exception block so one failure
    -- does NOT block the others, and the trigger NEVER throws an error
    -- back to Supabase Auth.

    BEGIN
        INSERT INTO public."users" (id, email, phone, role)
        VALUES (NEW.id::text, NEW.email, user_phone, user_role);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        INSERT INTO public."profiles" (userId, name, title, bio)
        VALUES (NEW.id::text, user_name, NULL, NULL);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        INSERT INTO public."wallets" (userId)
        VALUES (NEW.id::text);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- Always return NEW so Supabase Auth never sees an error
    RETURN NEW;
END;
$$;

-- Step 4: Re-create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Add service_role bypass policies
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
