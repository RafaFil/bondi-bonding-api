const { getCompleteProfile, updateProfile } = require('../models/profile.model');

const getProfile = async (req, res) => {

    getCompleteProfile(req.params.username)
    .then( result => {
        if (result.username){
            return res.status(200).json({
                success: true,
                data: result
            })
        }
        else {
            return res.status(404).json({
                success: false,
                message:'User not found'
            })
        }
    })
    .catch( err => {
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    });
}

const editProfile = async ( req, res) => {

    const username = req.params.username;
    const { email, phone, description } = req.body;

    const fieldsToChange = {
        email : email,
        phone : phone,
        description : description
    }

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
                data: 'Data changed'
            });
        }

        if (!result.acknowledged) {
            return res.status(400).json({
                success: false,
                message: 'Error while updating'
            });
        }
    }
    )
    .catch( err => {
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    });

}

module.exports = {
    getProfile,
    editProfile
}