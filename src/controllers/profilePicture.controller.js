const { getPublicUrl, savePicture } = require("../models/profilePicture.model");

const getPicture = async (req, res) => {
    const result = await getPublicUrl(req.params.picKey);

    if (result.success) {
        return res.status(200).json({
            success: true,
            data: result.url
        });
    };

    return res.status(404).json({
        success: false,
        message: `No picture found for name ${req.params.picKey}`
    });
};

const postPicture = async (req, res) => {
    const result = await savePicture(req.file);

    if (result.success) {
        return res.status(200).json({
            data: result.fileKey,
            success: true
        });
    }

    return res.status(400).json({
        success: false,
        message: 'The image was not uploaded successfully'
    });
};

module.exports = {
    getPicture,
    postPicture
}