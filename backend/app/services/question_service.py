import os
import torch
from torch.nn import functional as F
from tokenizers import Tokenizer
from app.core.config import settings
from app.ml.transformer import EncoderDecoderModel

MODEL_DOWNLOAD_URL = "https://github.com/JaimeC13/LearnAI/releases/download/v1.0.0/modelo_llm_definitivo.pt"

class QuestionService:
    def __init__(self):
        self._initialize_engine()

    def _initialize_engine(self):
        self.tokenizer = Tokenizer.from_file(settings.TOKENIZER_PATH)
        self.vocab_size = self.tokenizer.get_vocab_size()
        self.PAD_ID = self.tokenizer.token_to_id("<PAD>")
        self.BOS_ID = self.tokenizer.token_to_id("<BOS>")
        self.EOS_ID = self.tokenizer.token_to_id("<EOS>")

        os.makedirs(os.path.dirname(settings.MODEL_PATH), exist_ok=True)
        if not os.path.exists(settings.MODEL_PATH):
            urllib.request.urlretrieve(MODEL_DOWNLOAD_URL, settings.MODEL_PATH)
            

        self.model = EncoderDecoderModel(self.vocab_size, self.PAD_ID).to(settings.DEVICE)
        self.model.load_state_dict(torch.load(settings.MODEL_PATH, map_location=settings.DEVICE))
        self.model.eval()

    def generate_question(self, text: str, beam_width: int = 5) -> str:
        self.model.eval()
        with torch.no_grad():
            inp_ids = self.tokenizer.encode(text).ids[:settings.ENCODER_MAX_LEN]
            inp_ids += [self.PAD_ID] * (settings.ENCODER_MAX_LEN - len(inp_ids))
            enc_ids = torch.tensor([inp_ids], dtype=torch.long, device=settings.DEVICE)
            encoder_out, enc_pad_mask = self.model.encode(enc_ids)

            beams = [([self.BOS_ID], 0.0, False)]
            for _ in range(settings.DECODER_MAX_LEN):
                candidates = []
                for seq, log_prob, done in beams:
                    if done:
                        candidates.append((seq, log_prob, True))
                        continue
                    dec_tensor = torch.tensor([seq], dtype=torch.long, device=settings.DEVICE)
                    T = dec_tensor.shape[1]
                    x = self.model.tok_emb(dec_tensor) + self.model.pos_emb_dec(torch.arange(T, device=settings.DEVICE))
                    for block in self.model.decoder_blocks:
                        x = block(x, encoder_out, enc_pad_mask)
                    x = self.model.ln_f(x)
                    logits = self.model.lm_head(x)[0, -1, :].clone()
                    
                    for token_id in set(seq):
                        logits[token_id] /= 1.3 if logits[token_id] > 0 else (1 / 1.3)

                    log_probs = F.log_softmax(logits, dim=-1)
                    top_log_probs, top_ids = torch.topk(log_probs, beam_width)
                    for lp, tid in zip(top_log_probs.tolist(), top_ids.tolist()):
                        candidates.append((seq + [tid], log_prob + lp, tid == self.EOS_ID))

                beams = sorted(candidates, key=lambda c: c[1] / (len(c[0]) ** 0.7), reverse=True)[:beam_width]
                if all(b[2] for b in beams):
                    break

            best_seq = max(beams, key=lambda c: c[1] / (len(c[0]) ** 0.7))[0]
            final_tokens = [t for t in best_seq if t not in (self.BOS_ID, self.EOS_ID, self.PAD_ID)]
            return self.tokenizer.decode(final_tokens)

question_service = QuestionService()