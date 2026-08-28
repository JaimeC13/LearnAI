import torch
import torch.nn as nn
from torch.nn import functional as F
from app.core.config import settings

class SelfAttentionHead(nn.Module):
    def __init__(self, head_size, block_size, causal):
        super().__init__()
        self.key = nn.Linear(settings.N_EMBD, head_size, bias=False)
        self.query = nn.Linear(settings.N_EMBD, head_size, bias=False)
        self.value = nn.Linear(settings.N_EMBD, head_size, bias=False)
        self.causal = causal
        if causal:
            self.register_buffer("tril", torch.tril(torch.ones(block_size, block_size)))
        self.dropout = nn.Dropout(settings.DROPOUT)

    def forward(self, x, pad_mask=None):
        B, T, C = x.shape
        k = self.key(x)
        q = self.query(x)
        wei = q @ k.transpose(-2, -1) * (k.shape[-1] ** -0.5)
        if self.causal:
            wei = wei.masked_fill(self.tril[:T, :T] == 0, -1e9)
        if pad_mask is not None:
            wei = wei.masked_fill(pad_mask.unsqueeze(1), -1e9)
        wei = F.softmax(wei, dim=-1)
        wei = self.dropout(wei)
        return wei @ self.value(x)

class CrossAttentionHead(nn.Module):
    def __init__(self, head_size):
        super().__init__()
        self.key = nn.Linear(settings.N_EMBD, head_size, bias=False)
        self.query = nn.Linear(settings.N_EMBD, head_size, bias=False)
        self.value = nn.Linear(settings.N_EMBD, head_size, bias=False)
        self.dropout = nn.Dropout(settings.DROPOUT)

    def forward(self, x_decoder, encoder_out, enc_pad_mask=None):
        q = self.query(x_decoder)
        k = self.key(encoder_out)
        v = self.value(encoder_out)
        wei = q @ k.transpose(-2, -1) * (k.shape[-1] ** -0.5)
        if enc_pad_mask is not None:
            wei = wei.masked_fill(enc_pad_mask.unsqueeze(1), -1e9)
        wei = F.softmax(wei, dim=-1)
        wei = self.dropout(wei)
        return wei @ v

class MultiHead(nn.Module):
    def __init__(self, heads_list):
        super().__init__()
        self.heads = nn.ModuleList(heads_list)
        self.proj = nn.Linear(settings.N_EMBD, settings.N_EMBD)
        self.dropout = nn.Dropout(settings.DROPOUT)

    def forward(self, *args, **kwargs):
        out = torch.cat([h(*args, **kwargs) for h in self.heads], dim=-1)
        return self.dropout(self.proj(out))

class FeedForward(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(settings.N_EMBD, 4 * settings.N_EMBD), nn.GELU(),
            nn.Linear(4 * settings.N_EMBD, settings.N_EMBD), nn.Dropout(settings.DROPOUT),
        )
    def forward(self, x):
        return self.net(x)

class EncoderBlock(nn.Module):
    def __init__(self):
        super().__init__()
        head_size = settings.N_EMBD // settings.N_HEAD
        self.sa = MultiHead([SelfAttentionHead(head_size, settings.ENCODER_MAX_LEN, causal=False) for _ in range(settings.N_HEAD)])
        self.ffwd = FeedForward()
        self.ln1 = nn.LayerNorm(settings.N_EMBD)
        self.ln2 = nn.LayerNorm(settings.N_EMBD)

    def forward(self, x, pad_mask):
        x = x + self.sa(self.ln1(x), pad_mask=pad_mask)
        x = x + self.ffwd(self.ln2(x))
        return x

class DecoderBlock(nn.Module):
    def __init__(self):
        super().__init__()
        head_size = settings.N_EMBD // settings.N_HEAD
        self.sa = MultiHead([SelfAttentionHead(head_size, settings.DECODER_MAX_LEN, causal=True) for _ in range(settings.N_HEAD)])
        self.ca = MultiHead([CrossAttentionHead(head_size) for _ in range(settings.N_HEAD)])
        self.ffwd = FeedForward()
        self.ln1 = nn.LayerNorm(settings.N_EMBD)
        self.ln2 = nn.LayerNorm(settings.N_EMBD)
        self.ln3 = nn.LayerNorm(settings.N_EMBD)

    def forward(self, x, encoder_out, enc_pad_mask):
        x = x + self.sa(self.ln1(x))
        x = x + self.ca(self.ln2(x), encoder_out, enc_pad_mask=enc_pad_mask)
        x = x + self.ffwd(self.ln3(x))
        return x

class EncoderDecoderModel(nn.Module):
    def __init__(self, vocab_size: int, pad_id: int):
        super().__init__()
        self.pad_id = pad_id
        self.tok_emb = nn.Embedding(vocab_size, settings.N_EMBD)
        self.pos_emb_enc = nn.Embedding(settings.ENCODER_MAX_LEN, settings.N_EMBD)
        self.pos_emb_dec = nn.Embedding(settings.DECODER_MAX_LEN, settings.N_EMBD)
        self.encoder_blocks = nn.ModuleList([EncoderBlock() for _ in range(settings.N_LAYER_ENC)])
        self.decoder_blocks = nn.ModuleList([DecoderBlock() for _ in range(settings.N_LAYER_DEC)])
        self.ln_f = nn.LayerNorm(settings.N_EMBD)
        self.lm_head = nn.Linear(settings.N_EMBD, vocab_size)

    def encode(self, enc_ids):
        B, T = enc_ids.shape
        pad_mask = (enc_ids == self.pad_id)
        x = self.tok_emb(enc_ids) + self.pos_emb_enc(torch.arange(T, device=settings.DEVICE))
        for block in self.encoder_blocks:
            x = block(x, pad_mask)
        return x, pad_mask