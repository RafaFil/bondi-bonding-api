const { getDb } = require('../configs/db.config');

const COLLECTION_NAME = process.env.STATIC_COLLECTION;
const BASE_PROJECTION = {
    $project: { _id: 0, type: 0 }
};

async function getByType(type) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
    .aggregate([
        { $match : { type : type } },
        BASE_PROJECTION
    ])
    .toArray();
}

module.exports = {
    getByType
}