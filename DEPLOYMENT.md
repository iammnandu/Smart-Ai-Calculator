# 🚀 Smart AI Calculator - Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** (for code hosting)
2. **Railway Account** (for backend deployment)
3. **Vercel Account** (for frontend deployment)
4. **Google Gemini API Key** (already have)

## 🔧 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git repository (if not done)
cd "/Users/nandurajesh/Documents/Nandu Engineering/Mini Project/Smart-Ai-Calculator"
git init
git add .
git commit -m "Smart AI Calculator - Ready for deployment"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/smart-ai-calculator.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Select the `calc-be-main` folder** as root directory
7. **Add Environment Variables:**

   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `PORT`: 8900
   - `PYTHONPATH`: /app

8. **Deploy** - Railway will automatically detect Python and install dependencies
9. **Copy the deployed URL** (e.g., `https://smart-ai-calculator-production.up.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - **Root Directory**: `calc-fe-main`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Add Environment Variable:**
   - `VITE_API_URL`: Your Railway backend URL (from Step 2)
7. **Deploy**

### Step 4: Update Frontend Environment

Update the frontend to use the production backend URL:

```bash
# In calc-fe-main directory
echo "VITE_API_URL=https://your-railway-backend-url.railway.app" > .env.production
```

### Step 5: Test Deployment

1. **Visit your Vercel URL** (e.g., `https://smart-ai-calculator.vercel.app`)
2. **Test drawing and analysis** to ensure backend connection works
3. **Check browser console** for any errors

## 🔄 Alternative: Manual Deployment

### For Backend (Railway/Render/Heroku):

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### For Frontend (Netlify):

```bash
# Build the frontend
cd calc-fe-main
npm run build

# Deploy dist folder to Netlify via drag-and-drop
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🛡️ Security Considerations

1. **API Keys**: Never commit API keys to GitHub
2. **Environment Variables**: Use platform-specific env var management
3. **CORS**: Consider restricting origins in production if needed
4. **Rate Limiting**: Consider adding rate limiting for the API

## 📊 Monitoring

1. **Railway**: Check logs and metrics in Railway dashboard
2. **Vercel**: Monitor deployments and analytics in Vercel dashboard
3. **API Usage**: Monitor Gemini API usage in Google Cloud Console

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Check CORS configuration in main.py
2. **Environment Variables**: Ensure all required env vars are set
3. **Build Failures**: Check package.json scripts and dependencies
4. **API Timeouts**: Consider increasing timeout limits

### Backend Health Check:

Visit: `https://your-backend-url.railway.app/`
Should return: `{"message": "Server is running"}`

### Frontend Health Check:

Visit: `https://your-frontend-url.vercel.app`
Should load the calculator interface

## 🎉 Success!

Your Smart AI Calculator should now be live and accessible worldwide!

**Backend**: `https://your-backend-url.railway.app`
**Frontend**: `https://your-frontend-url.vercel.app`
