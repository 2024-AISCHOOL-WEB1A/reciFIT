const tokenCleanupScheduler = require("./tokenCleanupScheduler");

// 스케줄러 작업 시작
const startSchedulers = () => {
  tokenCleanupScheduler.startTokenCleanupJob();
};

module.exports = { startSchedulers };
