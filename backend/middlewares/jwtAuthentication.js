const jwtUtil = require("../utils/jwtUtils");

const authenticateAccessToken = (req, res, next) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { valid, expired, decoded } = jwtUtil.verifyAccessToken(accessToken);

  // 토큰 유효성 검사
  if (!valid) {
    // 토큰 만료 검사
    if (expired) {
      // 만료
      return res.status(401).json({ message: "Access Token expired" });
    }
    // 유효하지 않는 토큰
    return res.status(403).json({ message: "Invalid access token" });
  }

  // 혹시 모를 체크 (decoded가 없는 일반적이지 않은 상화)
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // 토큰 정상 확인
  req.user = { userIdx: decoded.userIdx, accessToken };
  return next();
};

module.exports = authenticateAccessToken;
