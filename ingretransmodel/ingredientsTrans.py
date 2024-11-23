import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. JSON 파일 불러오기
with open('ingredientsDict.json', 'r', encoding='utf-8') as json_file:
    ingredients_dict = json.load(json_file)

# 2. 데이터 준비
data = []
for key, synonyms in ingredients_dict.items():
    for synonym in synonyms:
        data.append((synonym, key))

# DataFrame으로 변환
df = pd.DataFrame(data, columns=["Ingredient", "Label"])

# 3. 데이터 전처리
# X: 입력 문자열, y: 라벨 (식재료 키)
X = df["Ingredient"]
y = df["Label"]

# 텍스트 데이터를 TF-IDF 방식으로 벡터화
vectorizer = TfidfVectorizer(stop_words="english")
X_tfidf = vectorizer.fit_transform(X)

# 4. 모델 학습
# 학습 데이터와 테스트 데이터 분리
X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y, test_size=0.2, random_state=42)

# 로지스틱 회귀 모델 학습
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# 5. 모델 평가
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")

# 6. 예측 함수
def predict_ingredient(input_string):
    input_tfidf = vectorizer.transform([input_string])
    prediction = model.predict(input_tfidf)
    return prediction[0]

# 예시 예측
print(predict_ingredient("떡국떡"))  # 가래떡
print(predict_ingredient("가쓰오부시"))  # 가다랑어 육수
