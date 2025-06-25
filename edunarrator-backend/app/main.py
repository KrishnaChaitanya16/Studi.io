from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.utils import extract_text_from_file
from app.gemini_processor import generate_audio_summary, generate_mcqs, generate_flashcards
from app.murf_api import generate_voiceover
import os
import uuid

os.makedirs("temp", exist_ok=True)

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://studi-io.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process")
async def process_pdf(
    file: UploadFile = File(...),
    subject: str = Form(...),
    voiceTone: str = Form(...)
):
    """
    Process uploaded file and generate flashcards, MCQs, and audio narration
    """
    contents = await file.read()
    file_id = str(uuid.uuid4())
    temp_input_path = f"temp/{file_id}_{file.filename}"

    # Save uploaded file temporarily
    with open(temp_input_path, "wb") as f:
        f.write(contents)

    try:
        # 1️⃣ Extract text
        full_text = extract_text_from_file(temp_input_path)

        if not full_text or len(full_text.strip()) < 50:
            return {
                "flashcards": [],
                "flashcard_audio": [],
                "mcqs": []
            }

        # 2️⃣ Generate narration
        narration_text = generate_audio_summary(full_text)

        # 3️⃣ Generate single audio narration
        audio_url = ""
        if narration_text:
            try:
                audio_url = generate_voiceover(narration_text, voiceTone)
            except Exception as e:
                print(f"❌ Audio generation failed: {e}")

        # 4️⃣ Generate flashcards
        flashcards = generate_flashcards(full_text)

        # 5️⃣ Generate MCQs
        mcqs = generate_mcqs(full_text)

        # 6️⃣ OPTIONAL: Split audio_url to multiple flashcard audios (for now repeat same)
        flashcard_audio = [audio_url for _ in flashcards]

        return {
            "flashcards": flashcards,
            "flashcard_audio": flashcard_audio,
            "mcqs": mcqs
        }

    except Exception as e:
        print(f"❌ Processing error: {e}")
        return {
            "flashcards": [],
            "flashcard_audio": [],
            "mcqs": []
        }

    finally:
        if os.path.exists(temp_input_path):
            try:
                os.remove(temp_input_path)
            except Exception as e:
                print(f"⚠️ Failed to cleanup temp file: {e}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Flashcard API is running"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Flashcard Learning API", "version": "1.0.0"}