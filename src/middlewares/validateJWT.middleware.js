const jwt = require('jsonwebtoken');

const validateJWT = ( req, res, next) => {
    let token = req.header('Authorization');

    if ( !token || !token.startsWith('Bearer ') ) {
        return res.status(400).json({
            success: false,
            message: 'Wrong authenticacion scheme. Please use the Bearer scheme.'
        });
    }

    // Removing the "Bearer " part from the token
    token = token.replace(/^Bearer\s+/, '');

    try {
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED );
        req.username = uid;
        req.name = name;
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token invalid or expired.'
        });
    }

    next();
}

module.exports = {
    validateJWT
}