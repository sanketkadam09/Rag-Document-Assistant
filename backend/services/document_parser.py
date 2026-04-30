import pdfplumber
from PIL import Image
import pytesseract
import os


pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def extract_text_from_pdf(file_path):
    pages_text=[]

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                pages_text.append(text)

            else:
                #scanned page
                image=page.to_image(resolution=300)
                ocr_text =pytesseract.image_to_string(image.original)
                pages_text.append(ocr_text)
    return pages_text

def extract_text_from_image(file_path):

    image=Image.open(file_path)
    text= pytesseract.image_to_string(image)
    return [text]                
