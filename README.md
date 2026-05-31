AI Career Mentor — Minimal MVP

This repository contains a minimal scaffold for the AI Career Mentor MVP: a React frontend (Vite) and a FastAPI backend with a simple career-roadmap generator.

Quick start (requires Node.js, Python 3.10+):

Frontend

```bash
cd frontend
npm install
npm run dev
```

Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

The frontend expects the backend at `http://localhost:8000`.

Next steps:
- Add Tailwind CSS to the frontend
- Replace the placeholder generator with an AI model integration (OpenAI or other)
- Add Supabase auth and database
 
Environment variables

Create a `.env` in `backend/` (copy from `.env.example`) with:

```
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://your.supabase.co
SUPABASE_ANON_KEY=public-anon-key
```

Create frontend env vars with Vite (file `frontend/.env`):

```
VITE_SUPABASE_URL=https://your.supabase.co
VITE_SUPABASE_ANON=public-anon-key
```

Installing extra dependencies

Frontend (run in `frontend`):

```bash
npm install
# then install tailwind/postcss if not already installed
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Backend (run in `backend`):

```bash
pip install -r requirements.txt
```

