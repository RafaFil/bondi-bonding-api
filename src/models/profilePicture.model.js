const crypto = require('crypto');

const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const { getS3Client } = require('../configs/s3.config');

const BUCKET_NAME = process.env.BUCKET_NAME;

const generateImageName = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
}

// Creates or updates a file on the s3 bucket.
// picKey is used for matching and updating an existing file.
const storeInS3 = async ({ buffer, mimetype }, picKey) => {
    const fileKey = picKey ? picKey : generateImageName();

    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: buffer,
        ContentType: mimetype
    };

    const command = new PutObjectCommand(params);

    const uploadResult = await getS3Client().send(command);

    if (uploadResult.$metadata.httpStatusCode !== 200) {
        return { success: false };
    }

    return { success: true, fileKey };
}

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
}

// Generates a temporal public url for a specific file key.
const getPublicUrl = async (fileKey) => {
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

module.exports = {
    storeInS3,
    getPublicUrl,
    deleteFromS3
}