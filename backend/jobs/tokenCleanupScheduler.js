const cron = require("node-cron");
const jwtStoreUtil = require("../utils/jwtStoreUtil");

// 토큰 정리 스케줄러
const startTokenCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running token cleanup...");
    try {
      await Promise.all([
        jwtStoreUtil.deleteExpiredAccessTokens(),
        jwtStoreUtil.deleteExpiredRefreshTokens(),
      ]);
    } catch (err) {
      console.error("Error during token cleanup:", err);
    }
  });
};

module.exports = { startTokenCleanupJob };
