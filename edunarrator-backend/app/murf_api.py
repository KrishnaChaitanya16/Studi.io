import os
from murf import Murf
from dotenv import load_dotenv

load_dotenv()

VOICE_TONE_MAP = {
    "Calm Female": "en-UK-ruby",         # has Calm style
    "Energetic Male": "en-UK-theo",      # has Promo, Angry, Energetic feel
    "Professional Female": "en-UK-hazel",# Conversational + Clear
    "Enthusiastic Male": "en-UK-freddie",# Conversational + upbeat
    "Gentle Female": "en-UK-juliet",     # Conversational + Soft tone
    "Authoritative Male": "en-UK-gabriel" # Documentary + Promo = Confident
}

client = Murf(api_key=os.getenv("MURF_API_KEY"))

def generate_voiceover(text: str, voice_tone: str = "Calm Female") -> str:
    """
    Generate voiceover audio from text using Murf API
    
    Args:
        text: The text content to convert to speech
        voice_tone: The desired voice tone from VOICE_TONE_MAP
    
    Returns:
        str: URL to the generated audio file, empty string if failed
    """
    if not text or not text.strip():
        print("⚠️ Empty text provided for voiceover")
        return ""
    
    # Murf API has a strict 3000 character limit
    MAX_MURF_CHARS = 2900  # Leave some buffer
    
    if len(text) > MAX_MURF_CHARS:
        print(f"⚠️ Text too long ({len(text)} chars), truncating to {MAX_MURF_CHARS} chars...")
        # Smart truncation - try to end at sentence boundary
        truncated_text = text[:MAX_MURF_CHARS]
        last_period = truncated_text.rfind('.')
        last_exclamation = truncated_text.rfind('!')
        last_question = truncated_text.rfind('?')
        
        # Find the last sentence boundary
        last_sentence_end = max(last_period, last_exclamation, last_question)
        
        if last_sentence_end > MAX_MURF_CHARS - 500:  # If we found a reasonable sentence end
            text = truncated_text[:last_sentence_end + 1]
        else:
            text = truncated_text + "..."
    
    voice_id = VOICE_TONE_MAP.get(voice_tone, "en-UK-ruby")  # Default to Calm Female
    
    try:
        response = client.text_to_speech.generate(
            text=text,
            voice_id=voice_id
        )
        
        if hasattr(response, 'audio_file') and response.audio_file:
            print(f"✅ Audio generated successfully with voice: {voice_tone} ({len(text)} chars)")
            return response.audio_file
        else:
            print("❌ No audio file in response")
            return ""
            
    except Exception as e:
        print(f"🚨 Murf API Error: {str(e)}")
        return ""

def split_text_for_audio(text: str, max_chars: int = 2900) -> list:
    """
    Split long text into chunks suitable for audio generation
    
    Args:
        text: The text to split
        max_chars: Maximum characters per chunk
    
    Returns:
        list: List of text chunks
    """
    if len(text) <= max_chars:
        return [text]
    
    chunks = []
    remaining_text = text
    
    while len(remaining_text) > max_chars:
        # Find a good breaking point
        chunk = remaining_text[:max_chars]
        
        # Look for sentence boundaries
        last_period = chunk.rfind('.')
        last_exclamation = chunk.rfind('!')
        last_question = chunk.rfind('?')
        
        # Find the best sentence boundary
        best_break = max(last_period, last_exclamation, last_question)
        
        if best_break > max_chars - 500:  # If we found a reasonable break point
            break_point = best_break + 1
        else:
            # Fall back to word boundary
            last_space = chunk.rfind(' ')
            break_point = last_space if last_space > max_chars - 100 else max_chars
        
        chunks.append(remaining_text[:break_point].strip())
        remaining_text = remaining_text[break_point:].strip()
    
    # Add the remaining text
    if remaining_text:
        chunks.append(remaining_text)
    
    return chunks

def generate_long_voiceover(text: str, voice_tone: str = "Calm Female") -> list:
    """
    Generate voiceover for long text by splitting into chunks
    
    Args:
        text: The text content to convert to speech
        voice_tone: The desired voice tone
    
    Returns:
        list: List of audio URLs for each chunk
    """
    if not text or not text.strip():
        return []
    
    chunks = split_text_for_audio(text)
    audio_urls = []
    
    for i, chunk in enumerate(chunks):
        print(f"🎵 Generating audio chunk {i+1}/{len(chunks)} ({len(chunk)} chars)")
        audio_url = generate_voiceover(chunk, voice_tone)
        if audio_url:
            audio_urls.append(audio_url)
        else:
            print(f"❌ Failed to generate audio for chunk {i+1}")
    
    return audio_urls

def generate_flashcard_audio(flashcards: list, voice_tone: str = "Calm Female") -> list:
    """
    Generate separate audio for each flashcard's front and back
    
    Args:
        flashcards: List of flashcard dictionaries
        voice_tone: The desired voice tone
    
    Returns:
        list: Updated flashcards with audio URLs
    """
    updated_flashcards = []
    
    for i, card in enumerate(flashcards):
        print(f"🎧 Generating audio for flashcard {i+1}/{len(flashcards)}")
        
        # Generate audio for front (question)
        front_audio = generate_voiceover(card["front"], voice_tone)
        
        # Generate audio for back (answer) - make it more conversational
        back_text = f"The answer is: {card['back']}"
        back_audio = generate_voiceover(back_text, voice_tone)
        
        # Update the flashcard with audio URLs
        updated_card = card.copy()
        updated_card["front_audio"] = front_audio
        updated_card["back_audio"] = back_audio
        
        updated_flashcards.append(updated_card)
    
    return updated_flashcards

def get_available_voices():
    """Return list of available voice tones"""
    return list(VOICE_TONE_MAP.keys())