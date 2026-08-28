# backend/app/core/config.py
import torch
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "LearnIA Engine API"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
        "*",
    ]
    
    DEVICE: str = "cuda" if torch.cuda.is_available() else "cpu"
    
    MODEL_PATH: str = "checkpoints/modelo_llm_definitivo.pt"
    TOKENIZER_PATH: str = "checkpoints/tokenizer_bpe_v2_24k.json"
    
    ENCODER_MAX_LEN: int = 448
    DECODER_MAX_LEN: int = 32
    N_EMBD: int = 384
    N_HEAD: int = 8
    N_LAYER_ENC: int = 5
    N_LAYER_DEC: int = 5
    DROPOUT: float = 0.0

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()