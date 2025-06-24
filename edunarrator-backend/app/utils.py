import PyPDF2
import docx
import os
from typing import Optional

def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from various file formats (PDF, DOCX, TXT)
    """
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return ""
    
    file_extension = os.path.splitext(file_path)[1].lower()
    
    try:
        if file_extension == '.pdf':
            return extract_text_from_pdf(file_path)
        elif file_extension == '.docx':
            return extract_text_from_docx(file_path)
        elif file_extension == '.txt':
            return extract_text_from_txt(file_path)
        else:
            print(f"❌ Unsupported file format: {file_extension}")
            return ""
    except Exception as e:
        print(f"❌ Error extracting text from {file_path}: {e}")
        return ""

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF file"""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"❌ PDF extraction error: {e}")
        return ""
    
    return text.strip()

def extract_text_from_docx(docx_path: str) -> str:
    """Extract text from DOCX file"""
    text = ""
    try:
        doc = docx.Document(docx_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        print(f"❌ DOCX extraction error: {e}")
        return ""
    
    return text.strip()

def extract_text_from_txt(txt_path: str) -> str:
    """Extract text from TXT file"""
    try:
        with open(txt_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    except UnicodeDecodeError:
        # Try with different encoding if UTF-8 fails
        try:
            with open(txt_path, 'r', encoding='latin-1') as file:
                return file.read().strip()
        except Exception as e:
            print(f"❌ TXT extraction error: {e}")
            return ""
    except Exception as e:
        print(f"❌ TXT extraction error: {e}")
        return ""

def validate_extracted_text(text: str, min_length: int = 50) -> bool:
    """
    Validate if extracted text meets minimum requirements
    """
    return text and len(text.strip()) >= min_length

def clean_text(text: str) -> str:
    """
    Clean and normalize extracted text
    """
    if not text:
        return ""
    
    # Remove excessive whitespace
    text = ' '.join(text.split())
    
    # Remove any weird characters but keep basic punctuation
    import re
    text = re.sub(r'[^\w\s.,!?;:()\-\'"/@#$%&*+=<>[\]{}|\\~`]', ' ', text)
    
    # Remove excessive spaces again after cleaning
    text = ' '.join(text.split())
    
    return text.strip()