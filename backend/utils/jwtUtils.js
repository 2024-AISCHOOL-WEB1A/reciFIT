const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = 30 * 60 * 1000; // 30분
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7일

// Access Token 생성
const createAccessToken = (userIdx, res) => {
  const user = { userIdx };
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });

  if (res) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: ACCESS_TOKEN_EXPIRATION,
    });
  }
  return accessToken;
};

// Refresh Token 생성
const createRefreshToken = (userIdx, res) => {
  const user = { userIdx };
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION / 1000,
  });

  if (res) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: REFRESH_TOKEN_EXPIRATION,
    });
  }
  return refreshToken;
};

// Access Token 검증
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      // 만료
      return {
        valid: false,
        expired: true,
        decoded: null,
      };
    } else {
      // 유효하지 않음
      return {
        valid: false,
        expired: false,
        decoded: null,
      };
    }
  }
};

// Refresh Token 검증
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      // 만료
      return {
        valid: false,
        expired: true,
        decoded: null,
      };
    } else {
      // 유효하지 않음
      return {
        valid: false,
        expired: false,
        decoded: null,
      };
    }
  }
};

// Access Token 재발급
// const refreshAccessTokens = (refreshToken, res) => {
//   const { valid, expired, decoded } = verifyRefreshToken(refreshToken);

//   // 유효하지 않거나 만료된 경우
//   if (!valid || expired) {
//     return null;
//   }

//   // 유효한 경우 AccessToken 재발급
//   return createAccessToken(decoded.userIdx, res);
// };

module.exports = {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  // refreshAccessTokens,
};
