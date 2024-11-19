import os
import uuid
import time
import requests
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from io import BytesIO
from typing import Optional
from datetime import datetime, timezone
from pymongo import MongoClient

# .env 파일 로드
load_dotenv()

# 환경 변수에서 API 정보 불러오기
SECRET_KEY = os.getenv("CLOVA_SECRET_KEY")
API_URL = os.getenv("CLOVA_ENDPOINT")
PORT = int(os.getenv("PORT", 8000))

# MONGDO DB 환경 설정 변수
MONGODB_URL = os.getenv('MONGODB_URL')
MONGODB_PASSWORD = os.getenv('MONGODB_PASSWORD')
MONGODB_PORT = os.getenv('MONGODB_PORT')
MONGODB_USER = os.getenv('MONGODB_USER')
MONGODB_DATABASENAME = os.getenv('MONGODB_DATABASENAME')
# MONGODB_URI = f"mongodb://{MONGODB_USER}:{MONGODB_PASSWORD}@{MONGODB_URL}:{MONGODB_PORT}/{MONGODB_DATABASENAME}"

app = FastAPI()

# 몽고 DB 연결
# mongodb_client = MongoClient(MONGODB_URI)
mongodb_client = MongoClient(
    host=MONGODB_URL,
    port=int(MONGODB_PORT),
    username=MONGODB_USER,
    password=MONGODB_PASSWORD,
    authSource=MONGODB_DATABASENAME,
)
db = mongodb_client[MONGODB_DATABASENAME]
collection = db['ocr_results']

# 요청 데이터 모델 정의
class OCRRequest(BaseModel):
    photoUrl: str

@app.post("/ocr")
async def perform_ocr(request: OCRRequest):
    try:
        # 이미지 파일을 메모리에서 다운로드
        image_response = requests.get(request.photoUrl)
        if image_response.status_code != 200:
            raise HTTPException(status_code=404, detail="Image not found at provided URL")
        
        # 메모리에서 OCR 요청을 위한 JSON 데이터 설정
        request_json = {
            'images': [
                {
                    'format': 'jpg',
                    'name': 'recifit_receipt_image'
                }
            ],
            'requestId': str(uuid.uuid4()),
            'version': 'V2',
            'timestamp': int(round(time.time() * 1000))
        }

        # 요청 페이로드 설정
        payload = {'message': json.dumps(request_json).encode('UTF-8')}
        files = [('file', BytesIO(image_response.content))]
        headers = {'X-OCR-SECRET': SECRET_KEY}

        # OCR 요청 전송
        response = requests.post(API_URL, headers=headers, data=payload, files=files, timeout=30)

        # 응답 처리
        if response.status_code == 200:
            ocr_results = response.json()
            
             # MongoDB에 결과 저장
            ocr_record = {
                "photoUrl": request.photoUrl,
                "ocrResults": ocr_results,
                "timestamp": datetime.now(timezone.utc)
            }
            collection.insert_one(ocr_record)
            
            return ocr_results
        else:
            raise HTTPException(status_code=response.status_code, detail="OCR 요청 실패")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Uvicorn을 사용하여 서버 실행
if __name__ == "__main__":
    import uvicorn
    # uvicorn.run(app, host="0.0.0.0", port=PORT, reload=True)
    uvicorn.run(app, host="127.0.0.1", port=PORT, reload=True)
    
    # uvicorn app:app --reload 로 서버실행
    # python -m venv venv