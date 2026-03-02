# Hostinger Deployment Guide (Monolithic Structure)

Aapka project ab **Hostinger-Ready** hai. Humne Backend aur Frontend ko merge kar diya hai taaki vo ek saath chalein.

## 1. Project Structure
Ab aapka project aise dikhega:
- `/src` - Backend logic (Models, Controllers, Routes)
- `/frontend` - React/Vite source code
- `server.js` - Main entry point (Root mein)
- `package.json` - Root configuration

## 2. Deployment Steps on Hostinger

### Step A: Code taiyar karein
1. Apne main project folder mein ek terminal kholiye.
2. Sabse pehle frontend ka build banaiye (React ka build generate karega):
   ```bash
   npm run build
   ```
   *Isse `/frontend/dist` folder ban jayega.*

### Step B: GitHub par Push karein
1. Is poore project ko GitHub par push kijiye (sirf code, `.env` nahi).

### Step C: Hostinger Panel Setup
1. **Node.js Web App** option chuniye.
2. **Setup Source:** Apna GitHub repo connect karein.
3. **Application Root:** Isse `/` (root) par rakhen.
4. **Main Entry File:** `server.js` chuniye.
5. **Environment Variables:** Hostinger panel mein niche di gayi keys zaroor daalein:
   - `MONGODB_URI`
   - `REDIS_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `JWT_SECRET`
   - `PORT=5000` (Hostinger by default set kar deta hai)
   - `NODE_ENV=production`

## 3. Kaise kaam karega?
1. Hostinger aapka `server.js` start karega.
2. Jab koi bhi user aapki site khoyega, `server.js` automatically `frontend/dist/index.html` file serve karega.
3. `/api` waale saare calls backend controllers (`src/controllers/`) handle karenge.

## 4. Troubleshooting
- Agar images nahi dikh rahi, toh check karein ki Cloudinary keys sahi hain.
- Agar `/login` page nahi khul raha, toh check karein ki `server.js` mein wildcard `*` route theek se setup hai.

Aapka system ab ready hai! 🚀
