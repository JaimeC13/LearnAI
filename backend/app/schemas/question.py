from pydantic import BaseModel

class QuestionResponse(BaseModel):
    file_name: str
    generated_question: str
    extracted_text_preview: str
    device: str