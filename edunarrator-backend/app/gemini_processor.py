import os
import google.generativeai as genai
from dotenv import load_dotenv
import re

# Load API key from .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MAX_INPUT_CHARS = 3000
MODEL_NAME = "models/gemini-2.0-flash"

def safe_generate(model, prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print("🚨 Gemini API Error:", str(e))
        return ""

def generate_audio_summary(input_text: str) -> str:
    """Generate a comprehensive but concise audio summary/narration of the content"""
    trimmed_text = input_text[:MAX_INPUT_CHARS]
    prompt = (
    "Create a concise audio narration of this content for educational purposes. "
    "The narration should be conversational, engaging, and under 2500 characters. "
    "Focus on the most important concepts and key takeaways. "
    "Make it suitable for audio learning — clear, structured, and easy to follow. "
    "Strictly avoid any sound effects, intro music, stage directions, or dramatization. "
    "Start directly with the explanation, and maintain a professional, factual tone."
    "\n\nContent:\n" + trimmed_text
)

    model = genai.GenerativeModel(MODEL_NAME)
    return safe_generate(model, prompt)

def generate_flashcards(input_text: str) -> list:
    """Generate flashcards from the input content"""
    trimmed_text = input_text[:MAX_INPUT_CHARS]
    prompt = (
        "Generate exactly 10 flashcards from the content below. "
        "Each flashcard should have a clear question on the front and a comprehensive answer on the back. "
        "Focus on key concepts, definitions, and important facts. "
        "Make the back answers detailed but conversational for audio narration. "
        "Return in this exact format:\n"
        "Front: <question>\n"
        "Back: <answer>\n\n"
        "Repeat this format for all 10 cards. Do not add any introduction or extra text."
        "\n\nContent:\n" + trimmed_text
    )

    model = genai.GenerativeModel(MODEL_NAME)
    raw_output = safe_generate(model, prompt)

    flashcards = []
    blocks = re.split(r"Front:\s*", raw_output)
    
    for i, block in enumerate(blocks):
        if not block.strip():
            continue

        try:
            parts = block.split("Back:")
            if len(parts) == 2:
                front = parts[0].strip()
                back = parts[1].strip().split("\n\n")[0].strip()  # Take full answer before double newline
                if front and back:
                    flashcards.append({
                        "id": i,
                        "front": front,
                        "back": back,
                        "front_audio": "",  # Will be populated with audio URL
                        "back_audio": ""    # Will be populated with audio URL
                    })
        except Exception as e:
            print("❌ Failed to parse flashcard block:", block[:100], "...", str(e))
            continue

    return flashcards[:10]  # Return at most 10 valid flashcards

def generate_mcqs(input_text: str) -> list:
    """Generate multiple choice questions from the input content"""
    trimmed_text = input_text[:MAX_INPUT_CHARS]
    prompt = (
        "Generate exactly 5 multiple choice questions from the content below. "
        "Each question must have the format:\n"
        "Question: <text>\n"
        "A. <option 1>\nB. <option 2>\nC. <option 3>\nD. <option 4>\n"
        "Answer: <A/B/C/D>\n"
        "Return only this clean format. Do not add any introduction, explanation, or extra commentary."
        "\n\nContent:\n" + trimmed_text
    )

    model = genai.GenerativeModel(MODEL_NAME)
    raw_output = safe_generate(model, prompt)

    mcqs = []
    blocks = re.split(r"Question:\s*", raw_output)
    for block in blocks:
        if not block.strip():
            continue

        try:
            q_text = block.split("\n")[0].strip()
            options = re.findall(r"[A-D]\.\s*(.*)", block)
            answer_match = re.search(r"Answer:\s*([A-D])", block)
            if q_text and len(options) == 4 and answer_match:
                answer_idx = ord(answer_match.group(1)) - ord("A")
                mcqs.append({
                    "question": q_text,
                    "options": options,
                    "answer": answer_idx
                })
        except Exception as e:
            print("❌ Failed to parse MCQ block:", block[:100], "...", str(e))
            continue

    return mcqs[:5]  # Return at most 5 valid MCQs