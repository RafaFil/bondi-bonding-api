const { getDb } = require('../configs/db.config');

const COLLECTION_NAME = process.env.USERS_COLLECTION;
const BASE_PROJECTION = { $project: { _id: 0, hashpwd: 0 } };

const getCompleteProfile = async (username) => {
    const db = getDb();

    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { username } },
        BASE_PROJECTION
    ])
    .toArray()

    return result[0];
}

const updateProfile = async (username,changes) => {
    const db = getDb();

    const result = await db.collection(COLLECTION_NAME)
    .updateOne(
        {
            username : username
        },
        {
            $set: changes
        }
    );  

    return result;

}

module.exports = {
    getCompleteProfile,
    updateProfile
}