import jwt from 'jsonwebtoken';

const EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const SEED = process.env.SECRET_JWT_SEED;

export const generateJWT = ( uid, name ) => {
    const payload = { uid, name };

    return new Promise( (resolve, reject) => {
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h'
        }, (err, token) => {
            if ( err ) {
                console.log(err);
                reject();
            } else {
                resolve(token);
            }
        });
    });
};