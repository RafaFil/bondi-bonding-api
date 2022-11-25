const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt.helper');
const { updateProfile } = require('../models/profile.model');
const { findByUsername } = require('../models/users.model');

const RECOVERY_CODE_MAX = 999999;
const RECOVERY_CODE_MINIMUM = 100000;

const startPasswordRecovery = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            success: false,
            message: 'No username was provided.'
        });
    }

    const recoveryCode = Math.floor(Math.random() * (RECOVERY_CODE_MAX - RECOVERY_CODE_MINIMUM + 1)) + RECOVERY_CODE_MINIMUM;
    console.log(recoveryCode); // easier to retrieve during mock.
    const recoveryCodeExpireTime = Date.now() + 3600000;

    updateProfile(username, { recoveryCode, recoveryCodeExpireTime })
    .then( result => {
        if (!result.acknowledged) { 
            return res.status(400).json({
                success: false,
                message: 'An error ocurred while creating the reset token.'
            });
        }

        sendRecoveryCode(req, res);
    })
    .catch( err => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    });
};

const sendRecoveryCode = async (req, res) => {
    // send recovery code
    //const user = await findByUsername(req.body.username);
    
    return res.status(200).json({
        success: true,
        data: `Email sent successfully`
    });
}

const verifyRecoveryCode = async (req, res) => {
    const { username, recoveryCode } = req.body;

    if (!username || !recoveryCode) {
        return res.status(400).json({
            success: false,
            message: 'Missing username or recoveryCode in request body.'
        });
    }

    const user = await findByUsername(username);

    if (!user) {
        res.status(404).json({
            success: false,
            message: `No user was found for username ${username}`
        });
    }

    const recoveryCodeExpired = user.recoveryCodeExpireTime < Date.now();
    const recoveryCodeIsCorrect = user.recoveryCode === +recoveryCode;

    if (recoveryCodeIsCorrect && !recoveryCodeExpired) {
        const token = await generateJWT(username, user.name, 180);

        return res.status(200).json({
            success: true,
            data: {
                user,
                token
            }
        });
    }

    return res.status(400).json({
        success: false,
        message: 'Recovery code was incorrect or expired.'
    });
}

const updatePassword = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing username or password in request body.'
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: 'Bad length for password. Minimum length is 8.'
        });
    }

    const hashpwd = await bcrypt.hash(password, process.env.BCRYPT_SALT);

    updateProfile(username, { hashpwd })
    .then( result => {
        if (result.acknowledged) {
            return res.status(200).json({
                success: true,
                message: 'Password updated successfully.'
            });
        }

        return res.status(400).json({
            success: false,
            message: "An error ocurred while updating the user's password."
        });
    })
    .catch( err => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    });
}

module.exports = {
    startPasswordRecovery,
    verifyRecoveryCode,
    updatePassword
}