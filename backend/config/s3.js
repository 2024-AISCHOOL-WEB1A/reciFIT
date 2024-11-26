const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

// AWS S3 설정
const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY_ID,
  },
});

module.exports = s3;
