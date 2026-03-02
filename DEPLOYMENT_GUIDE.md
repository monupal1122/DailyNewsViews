# Deployment Guide for DailyNewsViews

This guide covers how to deploy both the frontend and backend of your news website.

## Important: Root Directory Issue

When deploying to Vercel or similar platforms, you may be asked to select the **Root Directory**. 

**Why?** Your frontend code is in the `frontend/` subfolder, not in the root directory.

**Solution:** When deploying, select `frontend` as the Root Directory in your hosting platform settings.

---

## Prerequisites

Before deploying, you'll need:

1. **GitHub Account** - Push your code to GitHub
2. **MongoDB** - MongoDB Atlas (free tier) or self-hosted
3. **Redis** - Redis Cloud (free tier) or self-hosted
4. **Cloudinary Account** - For image storage (free tier)

---

## Backend Deployment

### Option 1: Deploy Backend to Render (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a new repository on GitHub and push
   ```

2. **Deploy to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Create New → Web Service
   - Connect your GitHub repository
   - Settings:
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Environment**: Node

3. **Set Environment Variables** in Render dashboard:
   ```
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_secure_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   PORT=5000
   NODE_ENV=production
   ```

### Option 2: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Create new project → Deploy from GitHub repo
3. Add environment variables in Railway dashboard
4. Deploy will start automatically

---

## Frontend Deployment

### Option 1: Deploy Frontend to Vercel (Easiest)

1. **Push frontend code to GitHub** (if not already)

2. **Go to [Vercel](https://vercel.com)**:
   - Sign up with GitHub
   - Import your repository
   - **IMPORTANT - Root Directory**: Set to `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables** in Vercel:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy** - Click Deploy!

### Option 2: Deploy Frontend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create New → Static Site
3. Connect your GitHub repository
4. **Repository**: Select your repo
5. **Root Directory**: Set to `frontend`
6. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

7. **Set Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

---

## Quick Start (If you already have a server)

If you have a VPS or dedicated server:

### Backend
```bash
cd server
npm install --production
# Set environment variables
pm2 start server.js
```

### Frontend
```bash
cd frontend
npm install
npm run build
# Serve the dist folder with Nginx or the included server.js
node server.js
```

---

## Environment Variables Reference

### Backend (server/.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/newsdb
REDIS_URL=redis://username:password@host.redis.cloud:port
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_super_secret_key_min_32_chars
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
PORT=5000
NODE_ENV=production
```

### Frontend
```
VITE_API_BASE_URL=http://localhost:5000/api (development)
VITE_API_BASE_URL=https://your-backend-url.com/api (production)
```

---

## After Deployment

1. **Test the API**: Visit `https://your-backend-url.com/api/categories/full`
2. **Test the Frontend**: Visit `https://your-frontend-url.com`
3. **Check Admin Panel**: Visit `https://your-frontend-url.com/admin`
4. **Update API URL**: Make sure frontend points to your backend URL

---

## Troubleshooting

### Root Directory Not Found
If you get an error about not finding the project, make sure to set:
- **Vercel**: Root Directory = `frontend`
- **Render**: Root Directory = `frontend`

### CORS Issues
If you get CORS errors, make sure your backend has the correct CORS configuration in `server.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.com']
}));
```

### API Connection Issues
- Verify `VITE_API_BASE_URL` is set correctly in frontend
- Check browser console for errors
- Ensure backend is running and accessible

### Database Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network access is allowed

---

## Need Help?

If you need specific help with any deployment option, let me know which platform you want to use!
