const { getDb } = require('../configs/db.config');

const COLLECTION_NAME = process.env.USERS_COLLECTION;
const BASE_PROJECTION = { $project: { _id: 0, hashpwd: 0 } };

const getByCredentials = async (username, hashpwd) => {
    const db = getDb();

    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { username, hashpwd } },
        BASE_PROJECTION
    ])
    .toArray();

    return result[0];
}

module.exports = {
    getByCredentials
}