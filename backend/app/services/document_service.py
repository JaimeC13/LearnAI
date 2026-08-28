import io
from pypdf import PdfReader
from fastapi import HTTPException

class DocumentService:
    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes, filename: str) -> str:

        if not filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400, 
                detail="invalid file type. Only PDF files are supported."
            )

        try:

            pdf_stream = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_stream)
            
            if len(reader.pages) == 0:
                raise HTTPException(status_code=400, detail="The PDF file is empty.")

            raw_text = ""
            for page_num, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    raw_text += page_text + " "

            clean_text = " ".join(raw_text.split())

            if not clean_text.strip():
                raise HTTPException(
                    status_code=400, 
                    detail="No text could be extracted. The PDF might be a scanned image without OCR."
                )

            return clean_text

        except HTTPException as http_err:
            raise http_err
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Unexpected error processing the PDF: {str(e)}"
            )

document_service = DocumentService()