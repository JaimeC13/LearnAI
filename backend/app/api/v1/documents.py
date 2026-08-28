from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.document_service import document_service
from app.services.question_service import question_service
from app.schemas.document import DocumentExtractResponse
from pydantic import BaseModel

router = APIRouter()

class GenerateQuestionResponse(BaseModel):
    filename: str
    generated_question: str
    extracted_text_preview: str
    device: str

@router.post("/extract-text", response_model=DocumentExtractResponse)
async def extract_text_from_pdf(file: UploadFile = File(...)):
    file_bytes = await file.read()
    text = document_service.extract_text_from_pdf(file_bytes, file.filename)
    return DocumentExtractResponse(
        filename=file.filename,
        char_count=len(text),
        word_count=len(text.split()),
        extracted_text=text
    )

@router.post("/generate-question", response_model=GenerateQuestionResponse)
async def generate_question_from_pdf(file: UploadFile = File(...)):
    
    file_bytes = await file.read()
    
    text = document_service.extract_text_from_pdf(file_bytes, file.filename)
    
    question = question_service.generate_question(text)
    
    return GenerateQuestionResponse(
        filename=file.filename,
        generated_question=question,
        extracted_text_preview=text[:180] + "...",
        device=question_service.model.lm_head.weight.device.type
    )