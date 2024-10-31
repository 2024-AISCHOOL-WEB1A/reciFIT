const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../../config/db");
const jwtUtil = require("../../utils/jwtUtils");
const jwtStoreUtil = require("../../utils/jwtStoreUtil");

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

module.exports = router;