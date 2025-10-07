# 🚀 Vercel Deployment Guide for ZenQuery

## Prerequisites

1. ✅ **GitHub Repository**: https://github.com/chankire/ZenQuery
2. ✅ **Vercel Account**: Sign up at https://vercel.com (free tier is perfect!)
3. ✅ **Anthropic API Key**: Get from https://console.anthropic.com/

---

## Step-by-Step Deployment

### Step 1: Sign Up / Log In to Vercel

1. Go to **https://vercel.com**
2. Click **Sign Up** or **Log In**
3. Choose **Continue with GitHub** (recommended)
4. Authorize Vercel to access your GitHub account

---

### Step 2: Import Your GitHub Repository

1. Once logged in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"chankire/ZenQuery"** in the list
4. Click **"Import"**

![Import Project](https://vercel.com/_next/image?url=%2Fdocs-proxy%2Fstatic%2Fdocs%2Fconcepts%2Fgit%2Fimport-project.png&w=3840&q=75)

---

### Step 3: Configure Project Settings

Vercel will auto-detect it's a Next.js project. You should see:

**Framework Preset:** Next.js
**Root Directory:** `./` (leave as default)
**Build Command:** `npm run build` (auto-detected)
**Output Directory:** `.next` (auto-detected)

✅ **Don't change any of these!** Vercel auto-detects everything correctly.

---

### Step 4: Add Environment Variables (CRITICAL!)

This is the most important step! Your app won't work without the API key.

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Variable"**
3. Enter:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your actual API key from Anthropic (starts with `sk-ant-api03-...`)
   - **Environment:** Select **Production**, **Preview**, and **Development** (all 3)

![Environment Variables](https://vercel.com/_next/image?url=%2Fdocs-proxy%2Fstatic%2Fdocs%2Fconcepts%2Fprojects%2Fenvironment-variables.png&w=3840&q=75)

4. Click **"Add"**

---

### Step 5: Deploy!

1. Click the big **"Deploy"** button
2. Wait 2-3 minutes while Vercel:
   - ✅ Clones your repo
   - ✅ Installs dependencies
   - ✅ Builds your app
   - ✅ Deploys to global CDN

You'll see a build log streaming in real-time.

---

### Step 6: Celebrate! 🎉

Once deployment completes, you'll see:

```
🎉 Congratulations! Your project has been deployed!
```

Click **"Visit"** or **"Go to Dashboard"**

Your app is now live at: **https://zenquery-[random].vercel.app**

---

## Testing Your Deployment

1. Visit your deployed URL
2. You should see the beautiful ZenQuery landing page
3. Upload a test PDF (like your New Holland manual)
4. Wait for the executive summary
5. Ask questions and click on citations!

---

## Custom Domain (Optional)

Want to use your own domain like `zenquery.ai`?

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Add Domain"**
4. Enter your domain name
5. Follow Vercel's DNS configuration instructions

Vercel provides **free SSL certificates** automatically!

---

## Important Notes

### File Size Limitations on Vercel

⚠️ **Vercel has a 50MB request body limit on Hobby (free) plan**

For your 190MB New Holland manual:
- **Option 1:** Upgrade to Pro plan ($20/month) - increases limit to 4.5MB (still not enough)
- **Option 2:** Deploy to **Railway** or **Render** instead (no limits)
- **Option 3:** Implement chunked uploads (more complex)

**For most PDFs under 50MB, Vercel works perfectly!**

### Alternative Hosting for Large Files

If you need to support 100MB+ files, consider:

1. **Railway** (https://railway.app)
   - No request size limits
   - $5/month starter plan
   - Easy GitHub deployment

2. **Render** (https://render.com)
   - Free tier available
   - No request size limits
   - GitHub auto-deploy

3. **AWS/Azure/Google Cloud**
   - Full control
   - More complex setup
   - Pay-as-you-go pricing

---

## Updating Your Deployment

Every time you push to GitHub:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel **automatically redeploys** within 1-2 minutes! 🚀

---

## Monitoring and Analytics

Vercel Dashboard provides:
- ✅ **Deployment history** - See all deployments
- ✅ **Analytics** - Page views, visitors, performance
- ✅ **Logs** - Debug issues in production
- ✅ **Speed Insights** - Performance metrics

Access all of this in your project dashboard.

---

## Troubleshooting

### Deployment Failed

Check the build logs for errors. Common issues:
- Missing environment variables
- TypeScript errors
- Build command failures

### "API Key Missing" Error

1. Go to **Settings** → **Environment Variables**
2. Make sure `ANTHROPIC_API_KEY` is set
3. Redeploy the project

### PDF Viewer Not Loading

1. Check browser console for errors
2. Make sure you're using HTTPS (not HTTP)
3. Try a smaller test PDF first

### 413 Request Too Large

Your file exceeds Vercel's 50MB limit. Options:
- Use a smaller file
- Upgrade Vercel plan
- Deploy to Railway/Render instead

---

## Cost Breakdown

### Vercel
- **Free (Hobby):** Perfect for testing, up to 100GB bandwidth
- **Pro ($20/month):** Commercial use, analytics, larger limits

### Anthropic API
- **Pay-per-use:** ~$0.003 per 1K tokens
- **Example:** 190MB PDF analysis ≈ $0.50-$1.00
- **Q&A:** ~$0.01-0.05 per question

### Monthly Cost Estimate
- Vercel: $0-20
- API: $10-50 (depends on usage)
- **Total: $10-70/month** for a production app

---

## Next Steps

1. **Test thoroughly** with various documents
2. **Add authentication** (NextAuth.js, Clerk, Supabase Auth)
3. **Implement payments** (Stripe, Paddle)
4. **Add database** (Supabase, PlanetScale) for saving conversations
5. **Custom domain** for branding
6. **Analytics** (Vercel Analytics, Plausible, PostHog)

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Anthropic Docs:** https://docs.anthropic.com/

---

## Your URLs

- **GitHub:** https://github.com/chankire/ZenQuery
- **Vercel:** (will be provided after deployment)
- **Live App:** (will be provided after deployment)

---

Built with ❤️ using Claude Code
