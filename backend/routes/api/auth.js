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
// const getLeven = require("../../config/leven");
// const loadIngredients = require("../../utils/loadIngredients");
const generateRandomNickname = require("../../utils/generateRandomNickname");

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
      const provider = "kakao";

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
      } else {
        // 비회원
        isNewUser = true;
        userName = await generateRandomNickname();

        // 회원 가입
        const insertUserQuery = `
          INSERT INTO TB_USER (oauth_provider, oauth_id, oauth_email, nickname, last_login)
          VALUES (?, ?, ?, ?, NOW())`;
        const [insertResult] = await db.execute(insertUserQuery, [
          "kakao",
          profile.id,
          profile._json.kakao_account.email,
          userName,
        ]);
        // 새로 생성된 user_idx 가져오기
        userIdx = insertResult.insertId;
      }
      // Access Token 및 Refresh Token 발급
      const accessToken = jwtUtil.createAccessToken(userIdx, res);
      const refreshToken = jwtUtil.createRefreshToken(userIdx, res);

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

      // TODO : 응답 보내기 (토큰 형태로)
      // 응답보내기 (redirect)
      // if (["localhost:3000", "localhost:3001"].includes(req.headers.host)) {
      //   return res.redirect(
      //     `http://${req.headers.host}/login/callback?userIdx=${userIdx}&userName=${userName}&provider=${provider}&isNewUser=${isNewUser}`
      //   );
      // }
      return res.redirect(
        // `http://192.168.100.64:3001/login/callback?userIdx=${userIdx}&userName=${userName}&provider=${provider}&isNewUser=${isNewUser}`
        `http://localhost:3001/login/callback?userIdx=${userIdx}&userName=${userName}&provider=${provider}&isNewUser=${isNewUser}`
      );
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
      const provider = "google";

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
      } else {
        // 비회원
        isNewUser = true;
        userName = await generateRandomNickname();

        // 회원 가입
        const insertUserQuery = `
          INSERT INTO TB_USER (oauth_provider, oauth_id, oauth_email, nickname, last_login)
          VALUES (?, ?, ?, ?, NOW())`;
        const [insertResult] = await db.execute(insertUserQuery, [
          "google",
          profile.id,
          profile.emails[0].value,
          userName,
        ]);

        // 새로 생성된 user_idx 가져오기
        userIdx = insertResult.insertId;
      }

      // Access Token 및 Refresh Token 발급
      const accessToken = jwtUtil.createAccessToken(userIdx, res);
      const refreshToken = jwtUtil.createRefreshToken(userIdx, res);

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

      // TODO : 응답 보내기 (토큰 형태로)
      // 응답보내기 (redirect)
      // if (["localhost:3000", "localhost:3001"].includes(req.headers.host)) {
      //   return res.redirect(
      //     `http://${req.headers.host}/login/callback?userIdx=${userIdx}&userName=${userName}&provider=${provider}&isNewUser=${isNewUser}`
      //   );
      // }
      return res.redirect(
        // `http://192.168.100.64:3001/login/callback?userIdx=${userIdx}&userName=${userName}&provider=${provider}&isNewUser=${isNewUser}`
        `http://localhost:3001/login/callback?userIdx=${userIdx}&userName=${userName}&provider=${provider}&isNewUser=${isNewUser}`
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// 로그아웃
router.post("/logout", authenticateAccessToken, async (req, res) => {
  // const { refreshToken } = req.body;
  const { userIdx, accessToken } = req.user;
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

  // 유효성 검사 : null check (필요할까?)
  // if (!refreshToken) {
  //   return res.status(400).json({ message: "Refresh token is required" });
  // }

  // 토큰 삭제
  try {
    // access token 삭제
    if (accessToken) {
      await jwtStoreUtil.deleteAccessToken(userIdx, accessToken);
      res.clearCookie("accessToken"); // 쿠키에서 access token 삭제
    }

    // refresh token 삭제
    if (refreshToken) {
      await jwtStoreUtil.deleteRefreshToken(userIdx, refreshToken);
      res.clearCookie("refreshToken"); // 쿠키에서 refresh token 삭제
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// AccessToken 재발급
router.post("/token", async (req, res) => {
  // const { refreshToken } = req.body;
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

  // 유효성 검사 1: null check
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  // 유효성 검사 2: refresh token decode
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
    const accessToken = jwtUtil.createAccessToken(userIdx, res);

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
router.post("/upload/:type", authenticateAccessToken, async (req, res) => {
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
});

module.exports = router;
