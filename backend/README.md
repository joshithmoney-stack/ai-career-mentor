Backend for AI Career Mentor

Run locally:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Endpoint:
- `GET /` health check
- `POST /generate` JSON body `{ "education": "", "interest": "", "goal": "" }`

Replace `generate_roadmap` with an AI model call when ready.
