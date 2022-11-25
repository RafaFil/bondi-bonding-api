const jwt = require('jsonwebtoken');

const EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const SECRET_JWT_SEED = process.env.SECRET_JWT_SEED;

const generateJWT = ( uid, name, expiresIn = EXPIRES_IN ) => {
    const payload = { uid, name };

    return new Promise( (resolve, reject) => {
        jwt.sign( payload, SECRET_JWT_SEED, {
            expiresIn
        }, 
        (err, token) => {
            if ( err ) {
                console.log(err);
                reject();
            } else {
                resolve(token);
            }
        });
    });
};

module.exports = {
    generateJWT
}