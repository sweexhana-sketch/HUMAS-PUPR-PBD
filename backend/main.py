from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PUPR PBD AI Creative Studio API")

# Setup CORS to allow Next.js frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cek API Key. Jika tidak ada, jalankan dalam mode "Mock" (Simulasi)
API_KEY = os.getenv("OPENAI_API_KEY")
is_mock_mode = not API_KEY or API_KEY.strip() == ""

client = OpenAI(api_key=API_KEY) if not is_mock_mode else None

class PosterRequest(BaseModel):
    acara: str
    tema: str

@app.post("/buat-poster")
async def buat_poster(req: PosterRequest):
    try:
        if is_mock_mode:
            import urllib.parse
            
            # Jika tidak ada API key, kita gunakan AI gratis dari pollinations.ai
            # Pertama, kita buat prompt bahasa Inggris singkat karena pollinations lebih bagus dengan bahasa Inggris
            free_prompt = f"Official government poster of Indonesia. Event: {req.acara}. Theme: {req.tema}. Featuring infrastructure in Papua, cinematic lighting, ultra-realistic, professional graphic design, unlabelled"
            encoded_prompt = urllib.parse.quote(free_prompt)
            
            # URL ke pollinations (seed di-random agar hasilnya berbeda-beda)
            import random
            seed = random.randint(1, 100000)
            placeholder_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?seed={seed}&width=1024&height=1536&nologo=true"
            
            return {
                "status": "success",
                "hasil": placeholder_url,
                "note": "Menggunakan AI Gratis (Pollinations.ai) karena OpenAI API Key tidak ditemukan."
            }

        prompt = f"""
        Buat poster resmi pemerintah Indonesia.

        Instansi:
        Dinas Pekerjaan Umum dan Perumahan Rakyat (PUPR) Provinsi Papua Barat Daya.

        Acara:
        {req.acara}

        Tema:
        {req.tema}

        Panduan Visual:
        - Tampilkan ASN Orang Asli Papua yang menggunakan seragam resmi kuning atau biru gelap PUPR.
        - Latar belakang menampilkan infrastruktur pembangunan di Papua (jalan raya, jembatan, perumahan, air bersih).
        - Desain poster kementerian yang modern, profesional, elegan, dan resmi pemerintahan.
        - Tambahkan teks ucapan sesuai tema dan identitas PUPR Papua Barat Daya.
        - Kualitas pencahayaan sinematik dan detail ultra-realistis.
        """

        # Generate image using OpenAI DALL-E 3
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )

        image_url = response.data[0].url

        return {
            "status": "success",
            "hasil": image_url
        }
    except Exception as e:
        print(f"Error generating image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to PUPR PBD AI Creative Studio API"}
