# 🗄️ Supabase Setup Guide for ZenQuery

## Overview

This guide will walk you through setting up Supabase for ZenQuery, including:
- ✅ User authentication with magic email links
- ✅ PostgreSQL database for documents & conversations
- ✅ File storage for PDFs
- ✅ Row Level Security for data isolation
- ✅ Production-ready security

**Time needed:** 10-15 minutes

---

## Step 1: Create a Supabase Account

1. Go to **https://supabase.com/**
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Verify your email

---

## Step 2: Create a New Project

1. Once logged in, click **"New Project"**
2. Fill in the details:
   - **Name:** `zenquery` (or your preferred name)
   - **Database Password:** Generate a strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is perfect to start

3. Click **"Create new project"**
4. Wait 2-3 minutes for setup to complete

---

## Step 3: Get Your API Keys

1. In your project dashboard, click **"Settings"** (gear icon) in the sidebar
2. Click **"API"** under Project Settings
3. You'll see:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API keys:**
     - `anon` / `public` key
     - `service_role` / `secret` key (⚠️ keep this secret!)

4. **Copy these values** - you'll need them next!

---

## Step 4: Configure Environment Variables

In your project root, edit `.env.local`:

```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ Important:**
- Use the `anon`/`public` key, NOT the `service_role` key!
- The `NEXT_PUBLIC_` prefix makes it available in the browser (safe because of RLS)

---

## Step 5: Set Up the Database Schema

1. In Supabase dashboard, click **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. **Copy the entire contents** of `supabase/schema.sql` from your project
4. **Paste** into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`

This will create:
- ✅ `documents` table (stores uploaded files)
- ✅ `conversations` table (tracks chat sessions)
- ✅ `messages` table (stores Q&A history)
- ✅ Row Level Security policies (data isolation)
- ✅ Storage bucket for PDFs

**Expected output:** "Success. No rows returned"

---

## Step 6: Verify Database Setup

1. Click **"Table Editor"** in the sidebar
2. You should see three tables:
   - `documents`
   - `conversations`
   - `messages`

3. Click **"Storage"** in the sidebar
4. You should see a bucket named `documents`

---

## Step 7: Configure Email Authentication

1. Click **"Authentication"** in the sidebar
2. Click **"Providers"**
3. Find **"Email"** and make sure it's **enabled** (it should be by default)
4. Configure email settings:
   - **Enable Email Confirmations:** OFF (for magic links)
   - **Secure Email Change:** ON
   - **Secure Password Change:** ON

### Optional: Custom Email Templates

1. Click **"Email Templates"** under Authentication
2. Customize the **"Magic Link"** template:
   - Add your branding
   - Modify the message
   - Keep the `{{ .ConfirmationURL }}` variable!

---

## Step 8: Configure Site URL (Important!)

1. Go to **"Authentication"** → **"URL Configuration"**
2. Set **"Site URL"** to:
   - Development: `http://localhost:3000`
   - Production: `https://your-app.vercel.app`

3. Set **"Redirect URLs"** to:
   ```
   http://localhost:3000/**
   https://your-app.vercel.app/**
   ```

This allows the magic link to redirect properly!

---

## Step 9: Test Authentication Locally

1. Make sure your `.env.local` is configured
2. Start your development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000
4. You should be redirected to `/login`
5. Enter your email
6. Check your inbox for the magic link
7. Click the link - you should be logged in!

---

## Step 10: Test File Upload

1. After logging in, upload a test PDF
2. Check Supabase dashboard:
   - **Table Editor** → `documents` → should see your file
   - **Storage** → `documents` → should see the uploaded PDF

---

## Security Features Implemented

### Row Level Security (RLS)

Every table has RLS policies that ensure:
- ✅ Users can ONLY see their own documents
- ✅ Users can ONLY upload to their own folder
- ✅ Users can ONLY create conversations for their documents
- ✅ Complete data isolation between users

### Storage Security

- ✅ Files stored in user-specific folders: `{user_id}/{file_name}`
- ✅ Storage policies prevent cross-user access
- ✅ Only authenticated users can upload/download

### Authentication Security

- ✅ Magic link authentication (no passwords to leak)
- ✅ Email verification required
- ✅ Session tokens stored securely in HTTP-only cookies
- ✅ PKCE flow for extra security

---

## Production Deployment

### Vercel Environment Variables

When deploying to Vercel, add these environment variables:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:
   ```
   ANTHROPIC_API_KEY=your-key
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Make sure to set them for **Production**, **Preview**, and **Development**

### Update Supabase Site URL

1. In Supabase → **Authentication** → **URL Configuration**
2. Update **"Site URL"** to your Vercel URL: `https://yourapp.vercel.app`
3. Add to **"Redirect URLs"**: `https://yourapp.vercel.app/**`

---

## Monitoring & Logs

### View Authentication Activity

1. **Authentication** → **Users** - See all registered users
2. **Authentication** → **Logs** - See login attempts, errors

### View Database Activity

1. **Database** → **Roles** - See RLS policies in action
2. **Logs** → **Postgres Logs** - Debug database queries

### View Storage Activity

1. **Storage** → **Logs** - See upload/download activity

---

## Troubleshooting

### "Invalid API key" error
- Check that you're using the `anon` key, not `service_role`
- Verify the key is copied correctly (no extra spaces)
- Make sure `.env.local` is in the project root

### Magic link not working
- Check spam folder
- Verify Site URL is correct in Supabase settings
- Make sure email provider isn't enabled in Supabase

### "Row Level Security" errors
- Verify you're logged in (check auth state)
- Check that RLS policies were created (Step 5)
- View logs in Supabase → Database → Logs

### Files not uploading
- Check Storage bucket exists (named `documents`)
- Verify storage policies were created
- Check file size (<50MB for free tier)
- View Storage logs

---

## Supabase Free Tier Limits

- ✅ **500MB database** - Plenty for thousands of documents
- ✅ **1GB file storage** - ~50-100 PDFs depending on size
- ✅ **2GB bandwidth** - Good for moderate traffic
- ✅ **50MB max file upload** - Fine for most PDFs
- ✅ **50,000 monthly active users** - More than enough to start

### When to Upgrade

Upgrade to **Pro ($25/month)** when you hit:
- 500MB database limit
- 1GB storage limit
- Need larger file uploads (up to 5GB)
- Want dedicated resources

---

## Database Maintenance

### View Document Count

```sql
SELECT COUNT(*) FROM documents;
```

### View Storage Usage

```sql
SELECT pg_size_pretty(pg_database_size('postgres'));
```

### Clean Up Old Documents

```sql
-- Delete documents older than 90 days
DELETE FROM documents
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## Next Steps

1. ✅ **Test thoroughly** - Upload various file types
2. ✅ **Invite beta users** - Get real usage data
3. ✅ **Monitor usage** - Watch Supabase dashboard
4. ✅ **Set up backups** - Supabase has daily backups on Pro tier
5. ✅ **Add billing** - Integrate Stripe when ready to monetize

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Email support:** support@supabase.io (Pro tier only)

---

## Your Supabase is Now Ready! 🎉

You have a production-ready backend with:
- 🔐 Secure authentication
- 📊 Scalable database
- 📁 File storage
- 🔒 Complete data isolation
- 📈 Ready to monetize

Deploy to Vercel and start getting users!
