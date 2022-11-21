const bcrypt = require('bcryptjs');

const { getByCredentials } = require('../models/users.model');
const { generateJWT } = require('../helpers/jwt.helper');

const BCRYPT_SALT = process.env.BCRYPT_SALT;

const doAuth = async ({ body }, res) => {
    const { username, password } = body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: `Auth request must include username and password fields in the request's body.`
        });
    }

    const hashpwd = await bcrypt.hash(password, BCRYPT_SALT);
    const user = await getByCredentials(username, hashpwd);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: `No user was found for username ${username} or password was incorrect.`
        });
    }
    
    const token = await generateJWT(username, user.name);

    return res.status(200).json({
        success: true,
        data: {
            user: user,
            token: token
        }
    });
};

module.exports = {
    doAuth
}