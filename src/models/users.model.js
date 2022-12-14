const { getDb } = require('../configs/db.config');

const COLLECTION_NAME = process.env.USERS_COLLECTION;
const BASE_PROJECTION = { $project: { _id: 0, hashpwd: 0 } };

const findByCredentials = async (username, hashpwd) => {
    const db = getDb();

    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { username, hashpwd } },
        BASE_PROJECTION
    ])
    .toArray();

    return result[0];
}

const findByUsername = async (username) => {
    const db = getDb();

    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { username } },
        { $set: { uid: '$_id' } },
        BASE_PROJECTION
    ])
    .toArray();

    return result[0];
}

const insertUser = async(user) => {
    const db = getDb()

    const result =  db.collection(COLLECTION_NAME)
    .insertOne(user);

    return result;
}

module.exports = {
    findByCredentials,
    findByUsername,
    insertUser
}