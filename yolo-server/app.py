import os
import openai
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from datetime import datetime, timezone

# .env 파일 로드
load_dotenv()

# OpenAI API 키 설정
openai.api_key = os.getenv("OPEN_AI_KEY")

# 서버 환경 변수 불러오기
PORT = int(os.getenv("PORT", 8001))

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
collection = db['ingredient_detection_result']

# 요청 데이터 모델 정의
class IngredientsRequest(BaseModel):
  photoUrl: str

@app.post("/api/ingredients-detection")
async def api_ingredients(request: Request, body: IngredientsRequest):
  # IP 주소 확인
  # client_ip = request.client.host
  # if client_ip != "127.0.0.1":
  #   raise HTTPException(status_code=403, detail="Forbidden")

  # OpenAI API 요청
  try:
    # response = openai.ChatCompletion.create(
    #   model="gpt-4o-mini",
    #   messages=[
    #     {
    #       "role": "system",
    #       "content": (
    #         "너는 사진을 보고 사진 속 음식 재료 종류를 골라내는 역할을 할거야. "
    #         "너는 음식 재료 이름을 제외하고는 아무것도 이야기하지 못해. "
    #         "너는 반드시 한국어로 음식재료 이름을 응답해야해. "
    #         "사진 속 음식 재료는 높은 확률로 한국 음식이야. "
    #         "음식이 발견되지 않으면 반드시 빈 문자열로 응답해야해."
    #       )
    #     },
    #     {
    #       "role": "user",
    #       "content": (
    #         "해당 사진이 어떤 음식재료인지 단어로 이야기해줘. "
    #         "여러 종류의 음식재료라면 ,로 구분해서 말해줘. "
    #         "같은 재료가 있다면 중복해서 이야기하지 말고 1번만 말해야해. "
    #         "가급적 겹져져 있는 음식 재료도 꼼꼼히 살펴봐야해. "
    #         "음식이 발견되지 않으면 반드시 빈 문자열로 응답해야해."
    #       )
    #     },
    #     {
    #       "role": "user",
    #       "content": {
    #         "type": "image_url",
    #         "image_url": {
    #             "url": body.photoUrl,
    #         },
    #       },
    #     }
    #   ],
    #   max_tokens=500,
    # )
    response = openai.chat.completions.create(
      model="gpt-4o-mini",
      messages=[
        {
          "role": "system",
          "content": (
            "너는 사진 URL을 보고 음식 재료 종류를 골라내는 역할을 할 거야. "
            "음식 재료 이름만 응답하고, 반드시 한국어로 작성해야 해. "
            "사진 속 음식 재료는 높은 확률로 한국 음식이야. "
            "만약 음식 재료가 발견되지 않으면 빈 문자열로 응답해야 해."
          ),
        },
        {
          "role": "user",
          "content": (
            f"이 URL에 있는 사진 속 어떤 음식재료인지 단어로 이야기해줘: {body.photoUrl}"
            "여러 종류의 음식재료라면 ,로 구분해서 말해줘. "
            "보이는 모든 종류의 음식재료의 이름을 말해야해. "
            "차근차근 사진 속에서 보이는 모든 음식재료를 이름을 말해해야. "
            "사진 속에 보이는 음식재료는 하나도 놓쳐서는 안돼. "
            "사진 속에 있는 음식재료는 매우 많을 수도 있어. "
            "음식재료의 이름은 명확해야해. 과일, 채소 등의 포괄적인 단어를 써서는 안돼. "
            "같은 재료가 있다면 중복해서 이야기하지 말고 1번만 말해야해. "
            "가급적 겹져져 있는 음식 재료도 꼼꼼히 살펴봐야해. "
            "음식이 발견되지 않으면 반드시 빈 문자열로 응답해야해."
          ),
        },
      ],
      max_tokens=500,
    )
    # return {"ingredients_names": response}
    
    # 응답 처리
    if (
      hasattr(response, "choices") and
      len(response.choices) > 0 and
      hasattr(response.choices[0], "message") and
      hasattr(response.choices[0].message, "content")
    ):
      ingredient_detection_results = response.choices[0].message.content
    else:
      raise HTTPException(status_code=500, detail="Invalid response from OpenAI API")
    
    # MongoDB에 결과 저장
    ingredient_detection_record = {
      "photoUrl": body.photoUrl,
      "ingredientDetectionResults": ingredient_detection_results,
      "timestamp": datetime.now(timezone.utc)
    }
    collection.insert_one(ingredient_detection_record)

    return {"ingredients_names": ingredient_detection_results}

  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Unexpected server error: {str(e)}")
      
# Uvicorn을 사용하여 서버 실행
if __name__ == "__main__":
  import uvicorn
  # uvicorn.run(app, host="0.0.0.0", port=PORT, reload=True)
  uvicorn.run(app, host="127.0.0.1", port=PORT, reload=True)
  
  # uvicorn app:app --reload --host 127.0.0.1 --port 8001 로 서버실행
  # python -m venv venv