const { insertUser } = require('../models/users.model');
const bcrypt = require("bcryptjs");

const createUser = async ({ body },res) =>{

    const { name, username, password, email, birthdate, gender, phone } = body;
    if (!(name && username && password && email)) {
        return res.status(400).json({
            success: false,
            message: 'Required fields missing. Required fields are: name, username, password, email'
        });
    }

    const hashpwd = await bcrypt.hash(body.password, process.env.BCRYPT_SALT);

    if (body.username && body.username.includes(" ") ) {
        return res.status(400).json({
            success: false,
            message: 'Username does not fit the required pattern'
        });
    }

    const user = {
        name : name,
        username : username,
        hashpwd : hashpwd,
        gender : gender,
        phone : phone,
        email : email,
    };

    if (birthdate) {
        user.birthdate = new Date(birthdate);
    }

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
                message: 'There was an error while attempting to insert the user.'
            });
        }
    })
    .catch( err => {
        if(err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: `Duplicate username ${user.username}`
            });
        }
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    });

}

module.exports = {
    createUser
}