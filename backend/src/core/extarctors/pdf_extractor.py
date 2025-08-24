import requests
import tempfile
import fitz  
import re
from logger import logger

def clean_extracted_text(text: str) -> str:
    """
    Clean up common PDF text 
    """
    text = re.sub(r"\(cid:\d+\)", "", text)
    text = re.sub(r"\s{2,}", " ", text)
    text = re.sub(r"[।|]", ". ", text)
    return text.strip()

def extract_text_from_pdf_url(pdf_url: str) -> str:
    """
    Downloads and extracts clean text from a PDF URL using PyMuPDF.
    Returns plain cleaned-up text.
    """
    try:
        response = requests.get(pdf_url, timeout=15)
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(delete=True, suffix=".pdf") as tmp_file:
            tmp_file.write(response.content)
            tmp_file.flush()

            doc = fitz.open(tmp_file.name)
            full_text = "\n".join([page.get_text("text") for page in doc])
            return clean_extracted_text(full_text)

    except Exception as e:
        logger.error(f"Failed to extract from {pdf_url}: {e}")
        return ""