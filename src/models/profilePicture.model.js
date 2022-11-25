const { getUrl, putInS3, deleteFromS3 } = require("../services/s3.service");

// Creates or updates a profile picture in the s3 bucket.
// picKey is used for matching and updating an existing picture.
const savePicture = async (file, picKey) => {
    return putInS3({ 
        buffer: file.buffer, 
        mimeType: file.mimetype, 
        picKey 
    });
}

// Deletes a file with the given fileKey from the s3 bucket.
const deletePicture = async (fileKey) => {
    return deleteFromS3(fileKey);
}

// Generates a temporal public url for a specific file key.
const getPublicUrl = async (fileKey) => {
    return getUrl(fileKey);
};

module.exports = {
    savePicture,
    deletePicture,
    getPublicUrl
}