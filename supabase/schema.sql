-- ============================================================
-- SkillBazaar PK - Pakistan's Freelance Marketplace
-- Supabase PostgreSQL Schema with Row Level Security (RLS)
-- ============================================================
-- This schema is the PostgreSQL/Supabase equivalent of the
-- Prisma schema. All IDs use TEXT type to match the
-- Prisma SQLite schema. JSON-like fields use JSONB.
-- RLS policies are applied to ALL tables.
-- Compatible with Supabase Auth (auth.users).
-- ============================================================

-- ============================================================
-- 0. CLEANUP (safe re-run support)
-- ============================================================

-- Drop all existing RLS policies on public schema tables (to allow re-running)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Drop existing triggers (to allow re-running)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON "users";
DROP TRIGGER IF EXISTS update_profiles_updated_at ON "profiles";
DROP TRIGGER IF EXISTS update_categories_updated_at ON "categories";
DROP TRIGGER IF EXISTS update_gigs_updated_at ON "gigs";
DROP TRIGGER IF EXISTS update_orders_updated_at ON "orders";
DROP TRIGGER IF EXISTS update_wallets_updated_at ON "wallets";
DROP TRIGGER IF EXISTS update_courses_updated_at ON "courses";
DROP TRIGGER IF EXISTS update_teams_updated_at ON "teams";
DROP TRIGGER IF EXISTS update_disputes_updated_at ON "disputes";

-- Drop the password column if it exists (migration from old schema)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
    ) THEN
        ALTER TABLE "users" DROP COLUMN "password";
    END IF;
END $$;

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('FREELANCER', 'CLIENT', 'BOTH', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "GigStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'DENIED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'DELIVERED', 'REVISION', 'COMPLETED', 'CANCELLED', 'DISPUTED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "NotificationType" AS ENUM ('ORDER', 'MESSAGE', 'PAYMENT', 'SYSTEM', 'PROMOTIONAL');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT', 'WITHDRAWAL', 'REFUND');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'TEXT', 'QUIZ');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TeamRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- 2.1 Users (linked to Supabase Auth via auth.users)
-- Password is managed by Supabase Auth in auth.users table.
-- Row is auto-created by the handle_new_user() trigger on auth.users.
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT UNIQUE,
    "role" "Role" NOT NULL DEFAULT 'FREELANCER',
    "avatar" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2.2 Profiles
CREATE TABLE IF NOT EXISTS "profiles" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "bio" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Pakistan',
    "hourlyRate" INTEGER,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "responseTime" TEXT,
    "languages" TEXT,
    "education" TEXT,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.3 Categories (self-referencing)
CREATE TABLE IF NOT EXISTS "categories" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "icon" TEXT,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 2.4 Skills
CREATE TABLE IF NOT EXISTS "skills" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "skills_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 2.5 User Skills
CREATE TABLE IF NOT EXISTS "user_skills" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" "SkillLevel" NOT NULL DEFAULT 'INTERMEDIATE',
    "yearsOfExperience" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "user_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE ("userId", "skillId")
);

-- 2.6 Gigs
CREATE TABLE IF NOT EXISTS "gigs" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "deliveryDays" INTEGER NOT NULL,
    "revisions" INTEGER NOT NULL DEFAULT 3,
    "status" "GigStatus" NOT NULL DEFAULT 'DRAFT',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "thumbnail" TEXT,
    "images" JSONB,
    "faq" JSONB,
    "requirements" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "gigs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON UPDATE CASCADE,
    CONSTRAINT "gigs_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.7 Gig Packages
CREATE TABLE IF NOT EXISTS "gig_packages" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "gigId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "deliveryDays" INTEGER NOT NULL,
    "revisions" INTEGER NOT NULL DEFAULT 1,
    "features" JSONB,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "gig_packages_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "gigs"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.8 Orders
CREATE TABLE IF NOT EXISTS "orders" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
    "gigId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,
    "packageId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentMethod" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "requirements" TEXT,
    "deliveryNote" TEXT,
    "revisionNote" TEXT,
    "startedAt" TIMESTAMP WITH TIME ZONE,
    "deliveredAt" TIMESTAMP WITH TIME ZONE,
    "completedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "orders_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "gigs"("id") ON UPDATE CASCADE,
    CONSTRAINT "orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON UPDATE CASCADE,
    CONSTRAINT "orders_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "users"("id") ON UPDATE CASCADE,
    CONSTRAINT "orders_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "gig_packages"("id") ON UPDATE CASCADE
);

-- 2.9 Reviews
CREATE TABLE IF NOT EXISTS "reviews" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "revieweeId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "communication" DOUBLE PRECISION,
    "quality" DOUBLE PRECISION,
    "delivery" DOUBLE PRECISION,
    "comment" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON UPDATE CASCADE,
    CONSTRAINT "reviews_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "users"("id") ON UPDATE CASCADE,
    UNIQUE ("orderId", "reviewerId")
);

-- 2.10 Messages
CREATE TABLE IF NOT EXISTS "messages" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON UPDATE CASCADE,
    CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON UPDATE CASCADE
);

-- 2.11 Notifications
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.12 Wallets
CREATE TABLE IF NOT EXISTS "wallets" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL UNIQUE,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pendingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bankName" TEXT,
    "bankAccount" TEXT,
    "jazzcashNumber" TEXT,
    "easypaisaNumber" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.13 Transactions
CREATE TABLE IF NOT EXISTS "transactions" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "walletId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" "TransactionType" NOT NULL DEFAULT 'CREDIT',
    "amount" DOUBLE PRECISION NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "method" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'COMPLETED',
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON UPDATE CASCADE
);

-- 2.14 Portfolios
CREATE TABLE IF NOT EXISTS "portfolios" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "projectUrl" TEXT,
    "tags" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "portfolios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.15 Courses
CREATE TABLE IF NOT EXISTS "courses" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "thumbnail" TEXT,
    "level" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
    "duration" TEXT,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEnrollments" INTEGER NOT NULL DEFAULT 0,
    "totalLessons" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT,
    "tags" TEXT,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "users"("id") ON UPDATE CASCADE,
    CONSTRAINT "courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 2.16 Lessons
CREATE TABLE IF NOT EXISTS "lessons" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "content" TEXT,
    "duration" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "type" "LessonType" NOT NULL DEFAULT 'VIDEO',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.17 Enrollments
CREATE TABLE IF NOT EXISTS "enrollments" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    "completedLessons" JSONB,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "completedAt" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE ("userId", "courseId")
);

-- 2.18 Teams
CREATE TABLE IF NOT EXISTS "teams" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "avatar" TEXT,
    "inviteLink" TEXT UNIQUE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2.19 Team Members
CREATE TABLE IF NOT EXISTS "team_members" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE ("teamId", "userId")
);

-- 2.20 Disputes
CREATE TABLE IF NOT EXISTS "disputes" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL,
    "raisedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "disputes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON UPDATE CASCADE,
    CONSTRAINT "disputes_raisedBy_fkey" FOREIGN KEY ("raisedBy") REFERENCES "users"("id") ON UPDATE CASCADE
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");

-- Profiles indexes
CREATE INDEX IF NOT EXISTS "profiles_userId_idx" ON "profiles"("userId");

-- Categories indexes
CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories"("slug");
CREATE INDEX IF NOT EXISTS "categories_parentId_idx" ON "categories"("parentId");

-- Skills indexes
CREATE INDEX IF NOT EXISTS "skills_slug_idx" ON "skills"("slug");
CREATE INDEX IF NOT EXISTS "skills_categoryId_idx" ON "skills"("categoryId");

-- User Skills indexes
CREATE INDEX IF NOT EXISTS "user_skills_userId_idx" ON "user_skills"("userId");
CREATE INDEX IF NOT EXISTS "user_skills_skillId_idx" ON "user_skills"("skillId");

-- Gigs indexes
CREATE INDEX IF NOT EXISTS "gigs_categoryId_idx" ON "gigs"("categoryId");
CREATE INDEX IF NOT EXISTS "gigs_freelancerId_idx" ON "gigs"("freelancerId");
CREATE INDEX IF NOT EXISTS "gigs_status_idx" ON "gigs"("status");
CREATE INDEX IF NOT EXISTS "gigs_slug_idx" ON "gigs"("slug");

-- Gig Packages indexes
CREATE INDEX IF NOT EXISTS "gig_packages_gigId_idx" ON "gig_packages"("gigId");

-- Orders indexes
CREATE INDEX IF NOT EXISTS "orders_freelancerId_idx" ON "orders"("freelancerId");
CREATE INDEX IF NOT EXISTS "orders_clientId_idx" ON "orders"("clientId");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
CREATE INDEX IF NOT EXISTS "orders_orderId_idx" ON "orders"("orderId");

-- Reviews indexes
CREATE INDEX IF NOT EXISTS "reviews_revieweeId_idx" ON "reviews"("revieweeId");
CREATE INDEX IF NOT EXISTS "reviews_orderId_idx" ON "reviews"("orderId");

-- Messages indexes
CREATE INDEX IF NOT EXISTS "messages_conversationId_idx" ON "messages"("conversationId");
CREATE INDEX IF NOT EXISTS "messages_senderId_idx" ON "messages"("senderId");
CREATE INDEX IF NOT EXISTS "messages_receiverId_idx" ON "messages"("receiverId");

-- Notifications indexes
CREATE INDEX IF NOT EXISTS "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX IF NOT EXISTS "notifications_isRead_idx" ON "notifications"("isRead");

-- Wallets indexes
CREATE INDEX IF NOT EXISTS "wallets_userId_idx" ON "wallets"("userId");

-- Transactions indexes
CREATE INDEX IF NOT EXISTS "transactions_walletId_idx" ON "transactions"("walletId");
CREATE INDEX IF NOT EXISTS "transactions_orderId_idx" ON "transactions"("orderId");

-- Portfolios indexes
CREATE INDEX IF NOT EXISTS "portfolios_userId_idx" ON "portfolios"("userId");

-- Courses indexes
CREATE INDEX IF NOT EXISTS "courses_instructorId_idx" ON "courses"("instructorId");
CREATE INDEX IF NOT EXISTS "courses_status_idx" ON "courses"("status");
CREATE INDEX IF NOT EXISTS "courses_slug_idx" ON "courses"("slug");
CREATE INDEX IF NOT EXISTS "courses_categoryId_idx" ON "courses"("categoryId");

-- Lessons indexes
CREATE INDEX IF NOT EXISTS "lessons_courseId_idx" ON "lessons"("courseId");

-- Enrollments indexes
CREATE INDEX IF NOT EXISTS "enrollments_userId_idx" ON "enrollments"("userId");
CREATE INDEX IF NOT EXISTS "enrollments_courseId_idx" ON "enrollments"("courseId");

-- Teams indexes
CREATE INDEX IF NOT EXISTS "teams_ownerId_idx" ON "teams"("ownerId");

-- Team Members indexes
CREATE INDEX IF NOT EXISTS "team_members_teamId_idx" ON "team_members"("teamId");
CREATE INDEX IF NOT EXISTS "team_members_userId_idx" ON "team_members"("userId");

-- Disputes indexes
CREATE INDEX IF NOT EXISTS "disputes_orderId_idx" ON "disputes"("orderId");
CREATE INDEX IF NOT EXISTS "disputes_raisedBy_idx" ON "disputes"("raisedBy");
CREATE INDEX IF NOT EXISTS "disputes_status_idx" ON "disputes"("status");

-- ============================================================
-- 4. UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updatedAt column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON "profiles" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON "categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON "gigs" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON "orders" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON "wallets" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON "courses" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON "teams" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON "disputes" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. SUPABASE AUTH TRIGGER
-- ============================================================
-- Auto-creates rows in users, profiles, and wallets when a
-- new user signs up via Supabase Auth (auth.users).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-create user row
    INSERT INTO public."users" (id, email, phone, role)
    VALUES (
        NEW.id::text,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone::text),
        COALESCE(
            (NEW.raw_user_meta_data->>'role')::"Role",
            'FREELANCER'::"Role"
        )
    )
    ON CONFLICT (id) DO NOTHING;

    -- Auto-create profile
    INSERT INTO public."profiles" (userId, name, title, bio)
    VALUES (
        NEW.id::text,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NULL,
        NULL
    )
    ON CONFLICT (userId) DO NOTHING;

    -- Auto-create wallet
    INSERT INTO public."wallets" (userId)
    VALUES (NEW.id::text)
    ON CONFLICT (userId) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on ALL tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gigs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gig_packages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "wallets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "portfolios" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lessons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "enrollments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "disputes" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6.1 Users RLS Policies
-- ============================================================
-- Anyone can see basic public user info (id, role, avatar, isOnline)
DO $$ BEGIN
    CREATE POLICY "anon_select_public_users" ON "users"
        FOR SELECT TO anon, authenticated
        USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Users can insert their own record (handled by signup, typically via service role)
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_user" ON "users"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "id");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Users can update their own profile
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_user" ON "users"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "id")
        WITH CHECK (auth.uid()::text = "id");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.2 Profiles RLS Policies
-- ============================================================
-- Public read access to profiles
DO $$ BEGIN
    CREATE POLICY "anon_select_public_profiles" ON "profiles"
        FOR SELECT TO anon, authenticated
        USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Authenticated users can insert their own profile
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_profile" ON "profiles"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Authenticated users can update their own profile
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_profile" ON "profiles"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "userId")
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Authenticated users can delete their own profile
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_own_profile" ON "profiles"
        FOR DELETE TO authenticated
        USING (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.3 Categories RLS Policies
-- ============================================================
-- Public read access
DO $$ BEGIN
    CREATE POLICY "anon_select_all_categories" ON "categories"
        FOR SELECT TO anon, authenticated
        USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.4 Skills RLS Policies
-- ============================================================
-- Public read access
DO $$ BEGIN
    CREATE POLICY "anon_select_all_skills" ON "skills"
        FOR SELECT TO anon, authenticated
        USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.5 User Skills RLS Policies
-- ============================================================
-- Public read access
DO $$ BEGIN
    CREATE POLICY "anon_select_public_user_skills" ON "user_skills"
        FOR SELECT TO anon, authenticated
        USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Authenticated users can insert their own skills
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_user_skills" ON "user_skills"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Authenticated users can update their own skills
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_user_skills" ON "user_skills"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "userId")
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Authenticated users can delete their own skills
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_own_user_skills" ON "user_skills"
        FOR DELETE TO authenticated
        USING (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.6 Gigs RLS Policies
-- ============================================================
-- Public read for ACTIVE gigs
DO $$ BEGIN
    CREATE POLICY "anon_select_active_gigs" ON "gigs"
        FOR SELECT TO anon, authenticated
        USING ("status" = 'ACTIVE');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Freelancer can read all their own gigs (any status)
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_gigs" ON "gigs"
        FOR SELECT TO authenticated
        USING (auth.uid()::text = "freelancerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Freelancer can create their own gigs
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_gigs" ON "gigs"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "freelancerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Freelancer can update their own gigs
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_gigs" ON "gigs"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "freelancerId")
        WITH CHECK (auth.uid()::text = "freelancerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Freelancer can delete their own gigs
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_own_gigs" ON "gigs"
        FOR DELETE TO authenticated
        USING (auth.uid()::text = "freelancerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.7 Gig Packages RLS Policies
-- ============================================================
-- Public read for packages of ACTIVE gigs
DO $$ BEGIN
    CREATE POLICY "anon_select_active_gig_packages" ON "gig_packages"
        FOR SELECT TO anon, authenticated
        USING (
            EXISTS (SELECT 1 FROM "gigs" WHERE "gigs"."id" = "gig_packages"."gigId" AND "gigs"."status" = 'ACTIVE')
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Freelancer can read packages of their own gigs
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_gig_packages" ON "gig_packages"
        FOR SELECT TO authenticated
        USING (
            EXISTS (SELECT 1 FROM "gigs" WHERE "gigs"."id" = "gig_packages"."gigId" AND "gigs"."freelancerId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Freelancer can create packages for their own gigs
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_gig_packages" ON "gig_packages"
        FOR INSERT TO authenticated
        WITH CHECK (
            EXISTS (SELECT 1 FROM "gigs" WHERE "gigs"."id" = "gig_packages"."gigId" AND "gigs"."freelancerId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Freelancer can update packages of their own gigs
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_gig_packages" ON "gig_packages"
        FOR UPDATE TO authenticated
        USING (
            EXISTS (SELECT 1 FROM "gigs" WHERE "gigs"."id" = "gig_packages"."gigId" AND "gigs"."freelancerId" = auth.uid()::text)
        )
        WITH CHECK (
            EXISTS (SELECT 1 FROM "gigs" WHERE "gigs"."id" = "gig_packages"."gigId" AND "gigs"."freelancerId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Freelancer can delete packages of their own gigs
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_own_gig_packages" ON "gig_packages"
        FOR DELETE TO authenticated
        USING (
            EXISTS (SELECT 1 FROM "gigs" WHERE "gigs"."id" = "gig_packages"."gigId" AND "gigs"."freelancerId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.8 Orders RLS Policies
-- ============================================================
-- Both client and freelancer can read their orders
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_orders" ON "orders"
        FOR SELECT TO authenticated
        USING (auth.uid()::text = "clientId" OR auth.uid()::text = "freelancerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Client can create orders
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_orders" ON "orders"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "clientId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Both parties can update orders
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_orders" ON "orders"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "clientId" OR auth.uid()::text = "freelancerId")
        WITH CHECK (auth.uid()::text = "clientId" OR auth.uid()::text = "freelancerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.9 Reviews RLS Policies
-- ============================================================
-- Public read access to reviews
DO $$ BEGIN
    CREATE POLICY "anon_select_public_reviews" ON "reviews"
        FOR SELECT TO anon, authenticated
        USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Reviewer can create reviews
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_reviews" ON "reviews"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "reviewerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Reviewer can update their own review
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_reviews" ON "reviews"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "reviewerId")
        WITH CHECK (auth.uid()::text = "reviewerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Reviewer can delete their own review
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_own_reviews" ON "reviews"
        FOR DELETE TO authenticated
        USING (auth.uid()::text = "reviewerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.10 Messages RLS Policies
-- ============================================================
-- Both sender and receiver can read messages in their conversations
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_messages" ON "messages"
        FOR SELECT TO authenticated
        USING (auth.uid()::text = "senderId" OR auth.uid()::text = "receiverId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Sender can insert messages
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_messages" ON "messages"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "senderId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Receiver can mark messages as read
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_messages" ON "messages"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "receiverId")
        WITH CHECK (auth.uid()::text = "receiverId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.11 Notifications RLS Policies
-- ============================================================
-- User can only read their own notifications
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_notifications" ON "notifications"
        FOR SELECT TO authenticated
        USING (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- System can insert notifications (service role, or allow authenticated for self-notifications)
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_notifications" ON "notifications"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User can update their own notifications (mark as read)
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_notifications" ON "notifications"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "userId")
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User can delete their own notifications
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_own_notifications" ON "notifications"
        FOR DELETE TO authenticated
        USING (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.12 Wallets RLS Policies
-- ============================================================
-- User can only read their own wallet
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_wallet" ON "wallets"
        FOR SELECT TO authenticated
        USING (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User can create their own wallet (if not auto-created)
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_wallet" ON "wallets"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User can update their own wallet
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_wallet" ON "wallets"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "userId")
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.13 Transactions RLS Policies
-- ============================================================
-- User can only read their own transactions (via wallet ownership)
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_transactions" ON "transactions"
        FOR SELECT TO authenticated
        USING (
            EXISTS (SELECT 1 FROM "wallets" WHERE "wallets"."id" = "transactions"."walletId" AND "wallets"."userId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- System/User can create transactions for their own wallet
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_transactions" ON "transactions"
        FOR INSERT TO authenticated
        WITH CHECK (
            EXISTS (SELECT 1 FROM "wallets" WHERE "wallets"."id" = "transactions"."walletId" AND "wallets"."userId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.14 Portfolios RLS Policies
-- ============================================================
-- Public read access
DO $$ BEGIN
    CREATE POLICY "anon_select_public_portfolios" ON "portfolios"
        FOR SELECT TO anon, authenticated
        USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User can create their own portfolio
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_portfolio" ON "portfolios"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User can update their own portfolio
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_portfolio" ON "portfolios"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "userId")
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User can delete their own portfolio
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_own_portfolio" ON "portfolios"
        FOR DELETE TO authenticated
        USING (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.15 Courses RLS Policies
-- ============================================================
-- Public read for PUBLISHED courses
DO $$ BEGIN
    CREATE POLICY "anon_select_published_courses" ON "courses"
        FOR SELECT TO anon, authenticated
        USING ("status" = 'PUBLISHED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Instructor can read all their own courses (any status)
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_courses" ON "courses"
        FOR SELECT TO authenticated
        USING (auth.uid()::text = "instructorId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Instructor can create courses
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_courses" ON "courses"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "instructorId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Instructor can update their own courses
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_courses" ON "courses"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "instructorId")
        WITH CHECK (auth.uid()::text = "instructorId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Instructor can delete their own courses
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_own_courses" ON "courses"
        FOR DELETE TO authenticated
        USING (auth.uid()::text = "instructorId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.16 Lessons RLS Policies
-- ============================================================
-- Public read for lessons of PUBLISHED courses
DO $$ BEGIN
    CREATE POLICY "anon_select_published_lessons" ON "lessons"
        FOR SELECT TO anon, authenticated
        USING (
            EXISTS (SELECT 1 FROM "courses" WHERE "courses"."id" = "lessons"."courseId" AND "courses"."status" = 'PUBLISHED')
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Instructor can read all lessons of their own courses
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_lessons" ON "lessons"
        FOR SELECT TO authenticated
        USING (
            EXISTS (SELECT 1 FROM "courses" WHERE "courses"."id" = "lessons"."courseId" AND "courses"."instructorId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Instructor can create lessons for their own courses
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_lessons" ON "lessons"
        FOR INSERT TO authenticated
        WITH CHECK (
            EXISTS (SELECT 1 FROM "courses" WHERE "courses"."id" = "lessons"."courseId" AND "courses"."instructorId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Instructor can update lessons of their own courses
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_lessons" ON "lessons"
        FOR UPDATE TO authenticated
        USING (
            EXISTS (SELECT 1 FROM "courses" WHERE "courses"."id" = "lessons"."courseId" AND "courses"."instructorId" = auth.uid()::text)
        )
        WITH CHECK (
            EXISTS (SELECT 1 FROM "courses" WHERE "courses"."id" = "lessons"."courseId" AND "courses"."instructorId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Instructor can delete lessons of their own courses
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_own_lessons" ON "lessons"
        FOR DELETE TO authenticated
        USING (
            EXISTS (SELECT 1 FROM "courses" WHERE "courses"."id" = "lessons"."courseId" AND "courses"."instructorId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.17 Enrollments RLS Policies
-- ============================================================
-- User can read their own enrollments
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_enrollments" ON "enrollments"
        FOR SELECT TO authenticated
        USING (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Instructor can read enrollments for their courses
DO $$ BEGIN
    CREATE POLICY "authenticated_select_instructor_enrollments" ON "enrollments"
        FOR SELECT TO authenticated
        USING (
            EXISTS (SELECT 1 FROM "courses" WHERE "courses"."id" = "enrollments"."courseId" AND "courses"."instructorId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User can create their own enrollment
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_enrollments" ON "enrollments"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User can update their own enrollment (progress tracking)
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_enrollments" ON "enrollments"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "userId")
        WITH CHECK (auth.uid()::text = "userId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.18 Teams RLS Policies
-- ============================================================
-- Team members can read their teams
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_teams" ON "teams"
        FOR SELECT TO authenticated
        USING (
            "ownerId" = auth.uid()::text
            OR EXISTS (SELECT 1 FROM "team_members" WHERE "team_members"."teamId" = "teams"."id" AND "team_members"."userId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Owner can create teams
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_teams" ON "teams"
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid()::text = "ownerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Owner can update their teams
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_teams" ON "teams"
        FOR UPDATE TO authenticated
        USING (auth.uid()::text = "ownerId")
        WITH CHECK (auth.uid()::text = "ownerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Owner can delete their teams
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_own_teams" ON "teams"
        FOR DELETE TO authenticated
        USING (auth.uid()::text = "ownerId");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.19 Team Members RLS Policies
-- ============================================================
-- Team members can see their team's members
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_team_members" ON "team_members"
        FOR SELECT TO authenticated
        USING (
            auth.uid()::text = "userId"
            OR EXISTS (
                SELECT 1 FROM "teams"
                WHERE "teams"."id" = "team_members"."teamId"
                AND (
                    "teams"."ownerId" = auth.uid()::text
                    OR EXISTS (
                        SELECT 1 FROM "team_members" AS tm
                        WHERE tm."teamId" = "teams"."id" AND tm."userId" = auth.uid()::text
                    )
                )
            )
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Owner can add team members
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_team_members" ON "team_members"
        FOR INSERT TO authenticated
        WITH CHECK (
            EXISTS (SELECT 1 FROM "teams" WHERE "teams"."id" = "team_members"."teamId" AND "teams"."ownerId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Owner can update team member roles
DO $$ BEGIN
    CREATE POLICY "authenticated_update_team_members" ON "team_members"
        FOR UPDATE TO authenticated
        USING (
            EXISTS (SELECT 1 FROM "teams" WHERE "teams"."id" = "team_members"."teamId" AND "teams"."ownerId" = auth.uid()::text)
        )
        WITH CHECK (
            EXISTS (SELECT 1 FROM "teams" WHERE "teams"."id" = "team_members"."teamId" AND "teams"."ownerId" = auth.uid()::text)
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Owner can remove team members
DO $$ BEGIN
    CREATE POLICY "authenticated_delete_team_members" ON "team_members"
        FOR DELETE TO authenticated
        USING (
            EXISTS (SELECT 1 FROM "teams" WHERE "teams"."id" = "team_members"."teamId" AND "teams"."ownerId" = auth.uid()::text)
            OR auth.uid()::text = "userId"
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 6.20 Disputes RLS Policies
-- ============================================================
-- Both parties (client and freelancer) can read disputes for their orders
DO $$ BEGIN
    CREATE POLICY "authenticated_select_own_disputes" ON "disputes"
        FOR SELECT TO authenticated
        USING (
            auth.uid()::text = "raisedBy"
            OR EXISTS (
                SELECT 1 FROM "orders"
                WHERE "orders"."id" = "disputes"."orderId"
                AND ("orders"."clientId" = auth.uid()::text OR "orders"."freelancerId" = auth.uid()::text)
            )
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User can raise a dispute for orders they're part of
DO $$ BEGIN
    CREATE POLICY "authenticated_insert_own_disputes" ON "disputes"
        FOR INSERT TO authenticated
        WITH CHECK (
            auth.uid()::text = "raisedBy"
            AND EXISTS (
                SELECT 1 FROM "orders"
                WHERE "orders"."id" = "disputes"."orderId"
                AND ("orders"."clientId" = auth.uid()::text OR "orders"."freelancerId" = auth.uid()::text)
            )
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Both parties can update disputes they raised or are involved in
DO $$ BEGIN
    CREATE POLICY "authenticated_update_own_disputes" ON "disputes"
        FOR UPDATE TO authenticated
        USING (
            auth.uid()::text = "raisedBy"
            OR EXISTS (
                SELECT 1 FROM "orders"
                WHERE "orders"."id" = "disputes"."orderId"
                AND ("orders"."clientId" = auth.uid()::text OR "orders"."freelancerId" = auth.uid()::text)
            )
        )
        WITH CHECK (
            auth.uid()::text = "raisedBy"
            OR EXISTS (
                SELECT 1 FROM "orders"
                WHERE "orders"."id" = "disputes"."orderId"
                AND ("orders"."clientId" = auth.uid()::text OR "orders"."freelancerId" = auth.uid()::text)
            )
        );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
