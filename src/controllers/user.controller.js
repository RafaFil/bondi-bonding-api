const { insertUser } = require('../models/users.model');
const bcrypt = require("bcryptjs");

const registerUser = async ({ body },res) =>{

    const hashpwd = await bcrypt.hash(body.password, process.env.BCRYPT_SALT);

    if (body.username && body.username.includes(" ") ) {
        return res.status(400).json({
            success: false,
            message: "Username does not fit the required pattern"
        });
    }

    const user = {
        name : body.name,
        username : body.username,
        birthdate : body.birthdate,
        hashpwd : hashpwd,
        gender : body.gender,
        phone : body.phone,
        email : body.email,
    };

    insertUser(user)
    .then( result => {
        if (result.acknowledged) { 
            return res.status(200).json({
                success: true,
                data: result.insertedId
            });
        }

        if (!result.acknowledged) {
            return res.status(400).json({
                success: false,
                message: "There was an error while attempting to insert the user."
            });
        }
    })
    .catch( err => {
        console.log(err);
        if(err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: `Duplicate username ${user.username}`
            });
        }
        return res.status(500).json({
            success: false,
            message:"Internal server error"
        });
    });

}

module.exports = {
    registerUser
}