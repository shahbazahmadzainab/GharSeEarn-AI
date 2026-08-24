from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI
import os

from agent import AGENT_INSTRUCTIONS


# Load environment variables
load_dotenv(override=True)


# FastAPI app
app = FastAPI(title="GharSeEarn AI")


# CORS - allow Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ghar-se-earn-ai.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")

print("KEY LOADED:", bool(api_key))
print("KEY PREFIX:", api_key[:8] if api_key else "NONE")

if not api_key:
    raise RuntimeError("OPENAI_API_KEY is missing")

client = OpenAI(api_key=api_key)


@app.get("/")
def home():
    return {
        "message": "GharSeEarn AI Backend is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.post("/chat")
def chat(message: str):

    try:
        response = client.responses.create(
            model="gpt-5-mini",
            instructions=AGENT_INSTRUCTIONS,
            input=message
        )

        return {
            "response": response.output_text
        }

    except Exception as e:
        print("OPENAI ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )