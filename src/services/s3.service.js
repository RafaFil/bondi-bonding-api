const crypto = require('crypto');

const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const { getS3Client } = require("../configs/s3.config");

const BUCKET_NAME = process.env.BUCKET_NAME;

const generateFileName = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
}

// Generates a temporal signed public url for a specific file key.
const getUrl = async (fileKey) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey
    };

    const command = new GetObjectCommand(params);

    const url = await getSignedUrl(getS3Client(), command, { expiresIn: 3600 });

    if (url) {
        return { success: true, url };
    }
    return { success: false };
};

// Creates or updates a file on the s3 bucket.
// fileKey is used for matching and updating an existing file.
const putInS3 = async ({ buffer, mimetype, fileKey }) => {
    const key = fileKey ? fileKey : generateFileName();

    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimetype
    };

    const command = new PutObjectCommand(params);

    const uploadResult = await getS3Client().send(command);

    if (uploadResult.$metadata.httpStatusCode !== 200) {
        return { success: false };
    }

    return { success: true, fileKey: key };
};

// Deletes a file with the given fileKey from the s3 bucket.
const deleteFromS3 = async (fileKey) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey
    };

    const command = new DeleteObjectCommand(params);

    const deleteResult = await getS3Client().send(command);

    if (deleteResult.$metadata.httpStatusCode !== 200) {
        return { success: false };
    }

    return { success: true };
};

module.exports = {
    putInS3,
    getUrl,
    deleteFromS3
}