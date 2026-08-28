from pydantic import BaseModel

class DocumentExtractResponse(BaseModel):
    filename: str
    char_count: int
    word_count: int
    extracted_text: str