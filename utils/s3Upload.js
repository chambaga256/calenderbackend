require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const crypto = require("crypto");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  const key = `cvs/${crypto.randomUUID()}-${file.originalname}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = uploadToS3;
