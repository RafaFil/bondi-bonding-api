const { getPublicUrl } = require('../models/profilePicture.model');

const setProfilePicture = async (userDoc) => {
    if (!userDoc.iconKey) {
        return userDoc;
    }
    const result = await getPublicUrl(userDoc.iconKey);
    if (result.success) {
        userDoc.iconUrl = result.url;
    }

    return userDoc;
}

module.exports = {
    setProfilePicture
}