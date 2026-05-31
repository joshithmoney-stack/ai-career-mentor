import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_API_KEY:
    try:
        import openai
        openai.api_key = OPENAI_API_KEY
    except Exception:
        openai = None
else:
    openai = None


class InputModel(BaseModel):
    education: str
    interest: str
    goal: str


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"status": "running"}


def generate_roadmap(education: str, interest: str, goal: str) -> dict:
    # If OpenAI is configured, use it to generate the roadmap; otherwise fallback to deterministic generator.
    if openai:
        prompt = (
            f"Create a concise career roadmap.\nEducation: {education}\nInterest: {interest}\nGoal: {goal}\n"
            "Include: skills, learning resources, and a 90-day study plan."
        )
        try:
            resp = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
            )
            text = resp.choices[0].message.content
            return {"roadmap": text}
        except Exception as e:
            # On API failure, fall back to deterministic generator below and include error info
            error_msg = f"(AI failed: {e})\n\n"
    else:
        error_msg = ""

    header = f"Career Roadmap for {education} → {goal} (Interest: {interest})\n\n"
    skills = [
        "Programming fundamentals (Python)",
        "Data Structures & Algorithms",
        "Math: Linear Algebra, Calculus, Probability",
        f"Introductory {interest} courses",
        "Software engineering best practices",
    ]
    roadmap = error_msg + header
    roadmap += "Skills to learn:\n"
    for s in skills:
        roadmap += f"- {s}\n"
    roadmap += "\n90-day plan:\n"
    roadmap += "Days 1-30: Fundamentals and small exercises.\n"
    roadmap += "Days 31-60: Build 2 small projects; learn tools.\n"
    roadmap += "Days 61-90: Complete a capstone project and portfolio.\n\n"
    roadmap += "Resources:\n- Free courses (Coursera, edX)\n- YouTube tutorials\n- Official docs and GitHub projects\n"
    return {"roadmap": roadmap}


@app.post("/generate")
def generate(input: InputModel):
    return generate_roadmap(input.education, input.interest, input.goal)
