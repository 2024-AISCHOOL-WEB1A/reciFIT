const db = require("../config/db");
const bcrypt = require("bcrypt");
const ms = require("ms");

// 토큰 암호화
// 암호화에 사용할 솔트 라운드
const SALT_ROUNDS = 10;

// 해시 생성
const hashToken = async (token) => {
  return await bcrypt.hash(token, SALT_ROUNDS);
};

// 해시 비교
const compareToken = async (token, hashedToken) => {
  return await bcrypt.compare(token, hashedToken);
};

// 토큰 DB 저장 / 삭제
// Access Token 저장
const saveAccessToken = async (userIdx, accessToken, expiresIn) => {
  const hashedToken = await hashToken(accessToken);
  const expiresAt = new Date(Date.now() + ms(expiresIn));
  const query = `
      INSERT INTO TB_USER_ACCESS_TOKEN (user_idx, access_token, expires_at)
      VALUES (?, ?, ?)
  `;
  try {
    await db.execute(query, [userIdx, hashedToken, expiresAt]);
  } catch (err) {
    console.error("jwtStore Error : Saving access token:", err);
    throw err;
  }
};

// Refresh Token 저장
const saveRefreshToken = async (userIdx, refreshToken, expiresIn) => {
  const hashedToken = await hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + ms(expiresIn));
  const query = `
      INSERT INTO TB_USER_REFRESH_TOKEN (user_idx, refresh_token, expires_at)
      VALUES (?, ?, ?)
  `;
  try {
    await db.execute(query, [userIdx, hashedToken, expiresAt]);
  } catch (err) {
    console.error("jwtStore Error : Saving refresh token:", err);
    throw err;
  }
};

// // Access Token 불러오기 (여러 개 반환)
// const getAccessTokens = async (userIdx) => {
//   const query = `
//       SELECT access_token, expires_at FROM TB_USER_ACCESS_TOKEN
//       WHERE user_idx = ? AND expires_at > NOW()
//   `;
//   try {
//     const [rows] = await db.execute(query, [userIdx]);
//     return rows;
//   } catch (err) {
//     console.error("jwtStore Error : fetching access tokens:", err);
//     throw err;
//   }
// };

// // Refresh Token 불러오기 (여러 개 반환)
// const getRefreshTokens = async (userIdx) => {
//   const query = `
//       SELECT refresh_token, expires_at FROM TB_USER_REFRESH_TOKEN
//       WHERE user_idx = ? AND expires_at > NOW()
//   `;
//   try {
//     const [rows] = await db.execute(query, [userIdx]);
//     return rows;
//   } catch (err) {
//     console.error("jwtStore Error : fetching refresh tokens:", err);
//     throw err;
//   }
// };

// Access Token 삭제
const deleteAccessToken = async (userIdx, accessToken) => {
  const query = `
      SELECT access_token FROM TB_USER_ACCESS_TOKEN
      WHERE user_idx = ?
  `;
  try {
    const [rows] = await db.execute(query, [userIdx]);
    if (rows.length === 0) return;

    // 저장된 해시된 토큰과 비교하여 일치하는 토큰 삭제
    for (const row of rows) {
      const isValid = await compareToken(accessToken, row.access_token);
      if (isValid) {
        const deleteQuery = `
            DELETE FROM TB_USER_ACCESS_TOKEN WHERE user_idx = ? AND access_token = ?
        `;
        await db.execute(deleteQuery, [userIdx, row.access_token]);
        return;
      }
    }
  } catch (err) {
    console.error("jwtStore Error : Deleting access token:", err);
    throw err;
  }
};

// Refresh Token 삭제
const deleteRefreshToken = async (userIdx, refreshToken) => {
  const query = `
      SELECT refresh_token FROM TB_USER_REFRESH_TOKEN
      WHERE user_idx = ?
  `;
  try {
    const [rows] = await db.execute(query, [userIdx]);
    if (rows.length === 0) return;

    // 저장된 해시된 토큰과 비교하여 일치하는 토큰 삭제
    for (const row of rows) {
      const isValid = await compareToken(refreshToken, row.refresh_token);
      if (isValid) {
        const deleteQuery = `
            DELETE FROM TB_USER_REFRESH_TOKEN WHERE user_idx = ? AND refresh_token = ?
        `;
        await db.execute(deleteQuery, [userIdx, row.refresh_token]);
        return;
      }
    }
  } catch (err) {
    console.error("jwtStore Error : Deleting refresh token:", err);
    throw err;
  }
};

// 만료된 Access Token 삭제
const deleteExpiredAccessTokens = async () => {
  const query = `
      DELETE FROM TB_USER_ACCESS_TOKEN WHERE expires_at < NOW()
  `;
  try {
    await db.execute(query);
    console.log("Expired access tokens deleted.");
  } catch (err) {
    console.error("jwtStore Error: Deleting expired access tokens:", err);
    throw err;
  }
};

// 만료된 Refresh Token 삭제
const deleteExpiredRefreshTokens = async () => {
  const query = `
      DELETE FROM TB_USER_REFRESH_TOKEN WHERE expires_at < NOW()
  `;
  try {
    await db.execute(query);
    console.log("Expired refresh tokens deleted.");
  } catch (err) {
    console.error("jwtStore Error: Deleting expired refresh tokens:", err);
    throw err;
  }
};

// 토큰 유효성 검사
// Access Token 유효성 검증
const isValidAccessToken = async (userIdx, accessToken) => {
  const query = `
      SELECT access_token FROM TB_USER_ACCESS_TOKEN
      WHERE user_idx = ? AND expires_at > NOW()
  `;
  try {
    const [rows] = await db.execute(query, [userIdx]);
    if (rows.length === 0) return false;

    // 저장된 모든 해시된 토큰과 비교
    for (const row of rows) {
      const isValid = await compareToken(accessToken, row.access_token);
      if (isValid) return true;
    }
    return false;
  } catch (err) {
    console.error("jwtStore Error : fetching access tokens:", err);
    throw err;
  }
};

// Refresh Token 유효성 검증
const isValidRefreshToken = async (userIdx, refreshToken) => {
  const query = `
      SELECT refresh_token FROM TB_USER_REFRESH_TOKEN
      WHERE user_idx = ? AND expires_at > NOW()
  `;
  try {
    const [rows] = await db.execute(query, [userIdx]);
    if (rows.length === 0) return false;

    // 저장된 모든 해시된 토큰과 비교
    for (const row of rows) {
      const isValid = await compareToken(refreshToken, row.refresh_token);
      if (isValid) return true;
    }
    return false;
  } catch (err) {
    console.error("jwtStore Error : fetching refresh tokens:", err);
    throw err;
  }
};

module.exports = {
  saveAccessToken,
  saveRefreshToken,
  // getAccessTokens,
  // getRefreshTokens,
  deleteAccessToken,
  deleteRefreshToken,
  deleteExpiredAccessTokens,
  deleteExpiredRefreshTokens,
  isValidAccessToken,
  isValidRefreshToken,
};
