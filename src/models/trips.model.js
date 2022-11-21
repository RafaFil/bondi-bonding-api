const { getDb } = require('../configs/db.config');

const COLLECTION_NAME = process.env.TRIPS_COLLECTION;
const BASE_PROJECTION = { $project: { tripId: '$_id', _id: 0 } };

const findTripById = async (tripId) => {
    const tripArr = await getDb()
    .collection(COLLECTION_NAME)
    .aggregate([
        { $match: { _id: tripId } },
        BASE_PROJECTION
    ])
    .toArray();

    if (tripArr && tripArr.length > 0) {
        return {
            success: true,
            data: tripArr[0]
        };
    }

    return { success: false };
}

const findTrips = async (queryParams = {}) => {
    const tripArr = await getDb()
    .collection(COLLECTION_NAME)
    .aggregate([
        { $match: queryParams },
        BASE_PROJECTION
    ])
    .toArray();

    return {
        success: true,
        data: tripArr
    }
}

const insertTrip = async (tripDoc) => {
    const result = await getDb()
    .collection(COLLECTION_NAME)
    .insertOne(tripDoc);

    if (result.acknowledged) {
        return {
            success: true,
            tripId: result.insertedId
        };
    }

    return { success: false  };
}

module.exports = {
    findTripById,
    findTrips,
    insertTrip
}