const { S3Client, DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

const BUCKET_REGION = process.env.BUCKET_REGION
const ACCESS_KEY = process.env.S3_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

let s3;

const getS3Client = () => {
    if (!s3) {
        s3 = new S3Client({
            region: BUCKET_REGION,
            credentials: {
                accessKeyId: ACCESS_KEY,
                secretAccessKey: SECRET_ACCESS_KEY,
            }
        });
    }

    return s3;
}

module.exports = {
    getS3Client
}