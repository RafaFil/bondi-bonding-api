const { ObjectId } = require('mongodb');
const { getDb } = require('../configs/db.config');

const COLLECTION_NAME = process.env.TRIPS_COLLECTION;
const STOPS_COLLECTION = process.env.STOPS_COLLECTION;
const LINES_COLLECTION = process.env.LINES_COLLECTION;
const USERS_COLLECTION = process.env.USERS_COLLECTION;
const BASE_PROJECTION = [
    { '$set': { 
        'tripId': '$_id', 
        'user.uid': '$user._id'
    } },
    { $project: { 
        '_id': 0, 
        'stopId': 0,
        'busLineId': 0,
        'userId': 0,
        'stop._id': 0, 
        'stop.lineIds': 0, 
        'line._id': 0, 
        'line.busstopIds': 0,
        'user._id': 0,
        'user.hashpwd': 0 
    } }
];
const LOOKUP = [
    { 
        $lookup: {
            from: STOPS_COLLECTION,
            localField: "stopId",
            foreignField: "busstopId",
            as: "stop"
        }
    },
    { 
        $lookup: {
            from: LINES_COLLECTION,
            localField: "busLineId",
            foreignField: "lineId",
            as: "line"
        } 
    },
    { 
        $lookup: {
            from: USERS_COLLECTION,
            localField: "userId",
            foreignField: "_id",
            as: "user"
        } 
    },
    { $unwind: { path: "$stop" } },
    { $unwind: { path: "$line" } },
    { $unwind: { path: "$user" } }
];

const findTripById = async (tripId) => {
    const tripArr = await getDb()
    .collection(COLLECTION_NAME)
    .aggregate([
        { $match: { _id: new ObjectId(tripId) } },
        ...LOOKUP,
        ...BASE_PROJECTION
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

const findTrips = async (matchQuery) => {
    const tripArr = await getDb()
    .collection(COLLECTION_NAME)
    .aggregate([
        { $match: matchQuery },
        ...LOOKUP,
        ...BASE_PROJECTION
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