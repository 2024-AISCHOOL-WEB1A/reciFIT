const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../../config/db");
const s3 = require("../../config/s3");
const jwtUtil = require("../../utils/jwtUtils");
const jwtStoreUtil = require("../../utils/jwtStoreUtil");
const { v4: uuidv4 } = require("uuid");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const authenticateAccessToken = require("../../Middlewares/jwtAuthentication");
const getLeven = require("../../config/leven");
const loadIngredients = require("../../utils/loadIngredients");

// 카카오 로그인
router.get(
  "/kakao",
  passport.authenticate("kakao", {
    session: false,
  })
);

// 카카오 로그인 Callback
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    session: false,
    failureRedirect: "/",
    scope: ["profile", "account_email"],
    prompt: "select_account",
  }),
  async (req, res) => {
    try {
      const { profile } = req.user;

      // 회원 여부 확인
      const query = `
        SELECT user_idx, nickname
        FROM TB_USER
        WHERE oauth_provider = ? AND oauth_id = ?`;

      const [rows] = await db.execute(query, ["kakao", profile.id]);

      let isNewUser = true;
      let userIdx = 0;
      let userName = "";

      if (rows.length > 0) {
        // 회원
        isNewUser = false;
        userIdx = rows[0].user_idx;
        userName = rows[0].nickname;

        // 최종 로그인 시간 DB 갱신
        const updateLoginQuery = `
          UPDATE TB_USER
          SET last_login = NOW()
          WHERE user_idx = ?`;
        await db.execute(updateLoginQuery, [userIdx]);

        // Access Token 및 Refresh Token 발급
        const accessToken = jwtUtil.createAccessToken(userIdx);
        const refreshToken = jwtUtil.createRefreshToken(userIdx);

        // JWT 저장
        await jwtStoreUtil.saveAccessToken(
          userIdx,
          accessToken,
          jwtUtil.ACCESS_TOKEN_EXPIRATION
        );
        await jwtStoreUtil.saveRefreshToken(
          userIdx,
          refreshToken,
          jwtUtil.REFRESH_TOKEN_EXPIRATION
        );

        // 응답 보내기
        return res.status(200).json({
          userIdx,
          userName,
          provider: profile.provider,
          accessToken,
          refreshToken,
          isNewUser,
        });
      } else {
        // 비회원
        isNewUser = true;
        userName = profile.displayName;

        // 회원 가입
        const insertUserQuery = `
          INSERT INTO TB_USER (oauth_provider, oauth_id, oauth_email, nickname, last_login)
          VALUES (?, ?, ?, ?, NOW())`;
        const [insertResult] = await db.execute(insertUserQuery, [
          "kakao",
          profile.id,
          profile._json.kakao_account.email,
          profile.displayName,
        ]);
        // 새로 생성된 user_idx 가져오기
        userIdx = insertResult.insertId;

        // Access Token 및 Refresh Token 발급
        const accessToken = jwtUtil.createAccessToken(userIdx);
        const refreshToken = jwtUtil.createRefreshToken(userIdx);

        // JWT 저장
        await jwtStoreUtil.saveAccessToken(
          userIdx,
          accessToken,
          jwtUtil.ACCESS_TOKEN_EXPIRATION
        );
        await jwtStoreUtil.saveRefreshToken(
          userIdx,
          refreshToken,
          jwtUtil.REFRESH_TOKEN_EXPIRATION
        );

        // 응답 보내기
        return res.status(200).json({
          userIdx,
          userName,
          provider: profile.provider,
          accessToken,
          refreshToken,
          isNewUser,
        });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// 구글 로그인
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// 구글 로그인 Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  async (req, res) => {
    try {
      const { profile } = req.user;

      // 회원 여부 확인
      const query = `
        SELECT user_idx, nickname
        FROM TB_USER
        WHERE oauth_provider = ? AND oauth_id = ?`;

      const [rows] = await db.execute(query, ["google", profile.id]);

      let isNewUser = true;
      let userIdx = 0;
      let userName = "";

      if (rows.length > 0) {
        // 회원
        isNewUser = false;
        userIdx = rows[0].user_idx;
        userName = rows[0].nickname;

        // 최종 로그인 DB 갱신
        const updateLoginQuery = `
          UPDATE TB_USER
          SET last_login = NOW()
          WHERE user_idx = ?`;
        await db.execute(updateLoginQuery, [userIdx]);

        // Access Token 및 Refresh Token 발급
        const accessToken = jwtUtil.createAccessToken(userIdx);
        const refreshToken = jwtUtil.createRefreshToken(userIdx);

        // JWT 저장
        await jwtStoreUtil.saveAccessToken(
          userIdx,
          accessToken,
          jwtUtil.ACCESS_TOKEN_EXPIRATION
        );
        await jwtStoreUtil.saveRefreshToken(
          userIdx,
          refreshToken,
          jwtUtil.REFRESH_TOKEN_EXPIRATION
        );

        // 응답 보내기
        return res.status(200).json({
          userIdx,
          userName,
          provider: profile.provider,
          accessToken,
          refreshToken,
          isNewUser,
        });
      } else {
        // 비회원
        isNewUser = true;
        userName = profile.displayName;

        // 회원 가입
        const insertUserQuery = `
          INSERT INTO TB_USER (oauth_provider, oauth_id, oauth_email, nickname, last_login)
          VALUES (?, ?, ?, ?, NOW())`;
        const [insertResult] = await db.execute(insertUserQuery, [
          "google",
          profile.id,
          profile.emails[0].value,
          profile.displayName,
        ]);

        // 새로 생성된 user_idx 가져오기
        userIdx = insertResult.insertId;

        // Access Token 및 Refresh Token 발급
        const accessToken = jwtUtil.createAccessToken(userIdx);
        const refreshToken = jwtUtil.createRefreshToken(userIdx);

        // JWT 저장
        await jwtStoreUtil.saveAccessToken(
          userIdx,
          accessToken,
          jwtUtil.ACCESS_TOKEN_EXPIRATION
        );
        await jwtStoreUtil.saveRefreshToken(
          userIdx,
          refreshToken,
          jwtUtil.REFRESH_TOKEN_EXPIRATION
        );

        // 응답 보내기
        return res.status(200).json({
          userIdx,
          userName,
          provider: profile.provider,
          accessToken,
          refreshToken,
          isNewUser,
        });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// AccessToken 재발급
router.post("/", async (req, res) => {
  const { refreshToken } = req.body;

  // null check
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  // refresh token 유효성 검사 (decode)
  const { valid, expired, decoded } = jwtUtil.verifyRefreshToken(refreshToken);
  // 유효하지 않거나 만료된 경우
  if (!valid || expired) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const userIdx = decoded.userIdx;
  // refresh token 유효성 검사2 (DB)
  try {
    const isValid = await jwtStoreUtil.isValidRefreshToken(
      userIdx,
      refreshToken
    );
    if (!isValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 토큰 재발행
    const accessToken = jwtUtil.createAccessToken(userIdx);

    // 토큰 DB 저장
    await jwtStoreUtil.saveAccessToken(
      userIdx,
      accessToken,
      jwtUtil.ACCESS_TOKEN_EXPIRATION
    );

    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// S3 업로드 요청
router.post(
  "/upload-image/:type",
  authenticateAccessToken,
  async (req, res) => {
    const { fileName, fileType } = req.body;
    const { type } = req.params;

    // 유효성 검사 1 : upload type 종류 제한
    if (!["ingredients", "receipt"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    // 유효성 검사 2 : 파일 이름 / 파일 타입 null or undefined
    if (!fileName || !fileType) {
      return res.status(400).json({ message: "Invalid fileName or fileType" });
    }

    // 유효성 검사 3 : 파일 타입 확인
    if (!["image/jpeg", "image/png"].includes(fileType)) {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // S3 저장
    const folder = `images/${type}`;
    const uniqueFileName = `${uuidv4()}-${fileName}`;
    const key = `${folder}/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    try {
      // Presigned URL 생성 (유효 시간: 5분)
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      return res.status(200).json({
        url,
        key,
      });
    } catch (err) {
      console.error("S3 Error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/test", async (req, res) => {
  const ingredientName = "풋사과";
  console.log(ingredientName);

  try {
    // 캐시된 재료 데이터와 leven 모듈 불러오기
    const ingredients = await loadIngredients();
    const leven = await getLeven();

    // 유사한 재료 찾기
    const similarIngredients = ingredients
      .map((name) => ({
        name,
        distance: leven(ingredientName, name),
      }))
      .filter((item) => item.distance < 3) // Levenshtein 거리 3 이하인 것만 추천
      .sort((a, b) => a.distance - b.distance) // 거리순으로 정렬
      .slice(0, 5); // 최대 5개만 반환

    console.log("?", {
      similarIngredients: similarIngredients.map((item) => item.name),
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
