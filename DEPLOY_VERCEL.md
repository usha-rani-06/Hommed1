# Deploy To Vercel (Frontend + Python API)

## 1) Push this repo to GitHub

```bash
git push -u origin main
```

## 2) Import project in Vercel

1. Open Vercel dashboard
2. `Add New` -> `Project`
3. Select this GitHub repo
4. Keep **Root Directory** as repo root (`hommed`)

This repo is already configured with:
- `vercel.json` for frontend build + SPA routes + API rewrites
- `api/index.py` as Python serverless entrypoint

## 3) Add Environment Variables (Vercel Project Settings)

Set these for **Production** (and Preview if needed):

- `MONGODB_URI`
- `DB_NAME` (example: `hommed`)
- `JWT_SECRET`
- `CLIENT_ORIGIN` (your deployed frontend URL, e.g. `https://your-project.vercel.app`)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional:
- `PORT` (not required on Vercel)

## 4) Redeploy

After env vars are added:
1. Trigger a new deployment from Vercel
2. Verify:
   - Frontend loads at `/`
   - API health works at `/api/health`
