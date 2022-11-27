const { getDb } = require('../configs/db.config');

const COLLECTION_NAME = process.env.USERS_COLLECTION;
const BASE_PROJECTION = { $project: { _id: 0, hashpwd: 0 } };

const getProfileByUsername = async (username, projection = BASE_PROJECTION) => {
    const db = getDb();

    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { username } },
        projection
    ])
    .toArray();
    
    if (result.length === 0) {
        return {
            success: false
        }
    }

    return { success: true, data: result[0] };
}

const getCompleteProfile = async (username) => {
    return getProfileByUsername(username);
}

const getPublicProfile = async (username) => {
    
    const projection = {
        $project: {
            _id: 0,
            description: 1,
            username: 1,
            birthdate: 1,
            gender: 1,
            phone: 1,
            email: 1,
            iconKey: 1
        }
    };

    return getProfileByUsername(username, projection);
}

const updateProfile = async (username, changes) => {
    const db = getDb();

    const result = await db.collection(COLLECTION_NAME)
    .updateOne(
        { username: username },
        { $set: changes }
    );  

    return result;
}

module.exports = {
    getCompleteProfile,
    getPublicProfile,
    updateProfile
}