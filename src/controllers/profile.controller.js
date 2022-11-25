const { getCompleteProfile, updateProfile, getPublicProfile } = require('../models/profile.model');
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

const getProfile = async (req, res, profFn = getPublicProfile) => {
    profFn(req.params.username)
    .then( async (result) => {
        if (result.success) {
            return res.status(200).json({
                success: true,
                data: await setProfilePicture(result.data)
            });
        } else {
            return res.status(404).json({
                success: false,
                message: `User with username ${req.params.username} not found`
            });
        }
    })
    .catch( err => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    });
}

const getPrivateProfile = async (req, res) => {
    return getProfile(req, res, getCompleteProfile);
}

const getPubProfile = async (req, res) => {
    return getProfile(req, res, getPublicProfile);
}

const editProfile = async ( { params, body }, res) => {
    const username = params.username;

    const fieldsToChange = {
        email: body.email,
        phone: body.phone,
        description: body.description,
        iconKey: body.iconKey
    };

    for (field in fieldsToChange) {
        if (typeof fieldsToChange[field] === "undefined") {
            delete fieldsToChange[field];
        }
    }

    updateProfile(username, fieldsToChange)
    .then( result => {
        if (result.acknowledged) { 
            return res.status(200).json({
                success: true,
                data: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s).`
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Error during update with the given parameters.'
            });
        }
    })
    .catch( err => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    });

}

module.exports = {
    getPrivateProfile,
    editProfile,
    getPubProfile
}