import requests
import tempfile
from pdfminer.high_level import extract_text_to_fp
from pdfminer.layout import LAParams
from io import StringIO
import fitz  
import re

def clean_extracted_text(text: str) -> str:
    """
    Clean up common PDF text artifacts such as (cid:xxxx) and extra spaces.
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
        print(f"[ERROR] Failed to extract from {pdf_url}: {e}")
        return ""

# def extract_from_pdfs(pdf_urls: List[str]) -> Dict[str, str]:
#     """
#     Takes a list of PDF URLs and returns a dict of {url: extracted_text}.
#     """
#     results = {}
#     for url in pdf_urls:
#         print(f"[INFO] Extracting from: {url}")
#         text = extract_text_from_pdf_url(url)
#         if text:
#             results[url] = text
#     return results


# if __name__ == "__main__":
#     test_urls = [
#         "https://shasanadesh.up.gov.in/frmPDF.aspx?qry=NjMjMTYyIzI4IzIwMTY%3D"
#     ]
#     data = extract_from_pdfs(test_urls)
#     for link, content in data.items():
#         print(f"\n--- PDF Extracted: {link} ---\n{content[:500]}")
