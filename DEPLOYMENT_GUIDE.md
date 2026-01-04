# 🚀 DEPLOYMENT GUIDE

## Your Project is Ready for Deployment!

### ✅ Files Created:
1. **netlify.toml** - React deployment config
2. **render.yaml** - Flask deployment config  
3. **requirements.txt** - Python dependencies (with gunicorn)

### ✅ Code Updated:
1. **Flask CORS** - Now allows Netlify domains
2. **Flask CSP** - Now allows Netlify iframe embedding
3. **React** - Already uses `VITE_FLASK_URL` environment variable

---

## 📦 STEP 1: Deploy Flask Backend on Render.com

### A. Create Render Account
1. Go to https://render.com
2. Click "Get Started" → Sign up with GitHub

### B. Deploy Flask
1. Click "New +" → "Web Service"
2. Connect your GitHub account
3. Create a **NEW** repository for Flask:
   - Repository name: `flask-study-monitoring`
   - Push Flask folder contents to this repo

4. In Render dashboard:
   - Select your Flask repository
   - Name: `flask-study-monitoring`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT app:app`

5. **Add Environment Variables** (in Render dashboard):
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   RESEND_API_KEY=your_resend_api_key_here
   REACT_DASHBOARD_URL=https://your-app.netlify.app (add after React deployment)
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. **COPY YOUR FLASK URL**: `https://flask-study-monitoring-xxxx.onrender.com`

### C. Push Flask to GitHub
```powershell
cd "C:\Users\PRANAY\Downloads\Cap\Enhaced_Study_Attention_Monitoring--main\Enhaced_Study_Attention_Monitoring--main\Attention_monitoring-main"

git init
git add .
git commit -m "Initial Flask deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/flask-study-monitoring.git
git branch -M main
git push -u origin main
```

---

## 🌐 STEP 2: Deploy React Frontend on Netlify

### A. Update React Environment Variables

Edit `.env` file:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
VITE_FLASK_URL=https://flask-study-monitoring-xxxx.onrender.com
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### B. Build React
```powershell
cd "C:\Users\PRANAY\Downloads\Cap\Design AI Learning Assistant UI (Copy) (Copy)"
npm run build
```

### C. Deploy to Netlify

**Method 1: Drag & Drop (Easiest)**
1. Go to https://app.netlify.com
2. Sign up/Login with GitHub
3. Drag the `dist` folder onto Netlify
4. Wait for deployment
5. **COPY YOUR URL**: `https://your-app-name.netlify.app`

**Method 2: GitHub (Recommended for Auto-Deploy)**
1. Push React project to GitHub:
```powershell
cd "C:\Users\PRANAY\Downloads\Cap\Design AI Learning Assistant UI (Copy) (Copy)"

git init
git add .
git commit -m "Initial React deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/react-learning-dashboard.git
git branch -M main
git push -u origin main
```

2. In Netlify:
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub → Select `react-learning-dashboard`
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Add Environment Variables** in Netlify:
   - Go to Site settings → Environment variables
   - Add all variables from `.env` file

**Method 3: Netlify CLI**
```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy from React folder
cd "C:\Users\PRANAY\Downloads\Cap\Design AI Learning Assistant UI (Copy) (Copy)"
npm run build
netlify deploy --prod
```

---

## 🔄 STEP 3: Update Flask with React URL

1. Go back to Render dashboard
2. Find your Flask service
3. Go to Environment → Add variable:
   ```
   REACT_DASHBOARD_URL=https://your-app-name.netlify.app
   ```
4. Save changes (will auto-redeploy)

---

## ✅ STEP 4: Test Your Deployment

1. Visit: `https://your-app-name.netlify.app`
2. Click "Get Started"
3. Sign in/Sign up
4. Verify: Study Session page loads
5. Verify: Flask iframe loads (not localhost!)
6. Start a monitoring session
7. Test mini-games
8. Complete session
9. Verify: Dashboard transition works

---

## 🎯 Quick Commands Summary

### Deploy Flask to Render:
```powershell
cd "C:\Users\PRANAY\Downloads\Cap\Enhaced_Study_Attention_Monitoring--main\Enhaced_Study_Attention_Monitoring--main\Attention_monitoring-main"
git init
git add .
git commit -m "Deploy to Render"
# Push to GitHub, then connect to Render
```

### Deploy React to Netlify:
```powershell
cd "C:\Users\PRANAY\Downloads\Cap\Design AI Learning Assistant UI (Copy) (Copy)"
npm run build
netlify deploy --prod
# Or drag 'dist' folder to netlify.com
```

---

## 🔧 Troubleshooting

### Flask not loading in iframe:
- Check Flask URL in React `.env`
- Verify Flask CSP allows your Netlify domain
- Check browser console for CORS errors

### Webcam not working:
- Netlify MUST use HTTPS (✅ automatic)
- Users must grant camera permissions
- Test in production, not localhost

### Environment variables not working:
- In Netlify: Site settings → Environment variables
- In Render: Environment tab → Add variable
- Redeploy after adding variables

---

## 🎉 Your Live URLs

**React Frontend**: `https://your-app-name.netlify.app`  
**Flask Backend**: `https://flask-study-monitoring-xxxx.onrender.com`

### Share with users:
"Visit https://your-app-name.netlify.app to try the AI-powered study monitoring platform!"

---

## 📝 Important Notes

1. **Free Tier Limitations**:
   - Render: Flask sleeps after 15 min inactivity (first load takes 30-60 sec)
   - Netlify: 100GB bandwidth/month (plenty for testing)

2. **API Keys**: Keep them secret! Never commit to GitHub without `.gitignore`

3. **Database**: Your Supabase database works globally (no changes needed)

4. **Custom Domain**: Both Netlify and Render support custom domains in paid plans

---

Ready to deploy! 🚀
