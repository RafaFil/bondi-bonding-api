const { ObjectId } = require('mongodb');
const { getDb } = require('../configs/db.config');
const { setProfilePicture } = require('../helpers/profileIcon.helper');

const COLLECTION_NAME = process.env.TRIPS_COLLECTION;
const STOPS_COLLECTION = process.env.STOPS_COLLECTION;
const LINES_COLLECTION = process.env.LINES_COLLECTION;
const USERS_COLLECTION = process.env.USERS_COLLECTION;
const BASE_PROJECTION = [
    { '$set': { 
        'tripId': '$_id', 
        'user.uid': '$user._id',
        'user.age': { $dateDiff: { startDate: "$user.birthdate", endDate: "$$NOW", unit: "year" } }
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

const setUserProfilePictures = async (result) => {
    for (const res of result) {
        if (!res.user) {
            continue;
        }

        res.user = await setProfilePicture(res.user);
    }

    return result;
}

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
        await setUserProfilePictures(tripArr)

        return {
            success: true,
            data:  tripArr[0]
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

    await setUserProfilePictures(tripArr)
    return {
        success: true,
        data: tripArr
    }
}

const filterTrips = async ({ myAge, myGender, from, to, minAge, maxAge, gender, likes }) => {

    const matchQuery = {
        $and: [
            {
                $or: [ 
                    { 'filters.gender': { $exists: false } }, { 'filters.gender': myGender }
                ] 
            },
            {
                $or: [ 
                    { 'filters.ageRange.min': { $exists: false } }, { 'filters.ageRange.min': { $lte: myAge } }
                ]
            },
            {
                $or: [ 
                    { 'filters.ageRange.max': { $exists: false } }, { 'filters.ageRange.max': { $gte: myAge } }
                ]
            }
        ]
    };
    
    if (from) {
        matchQuery.from = from;
    }

    if (to) {
        matchQuery.to = to;
    }

    if (minAge || maxAge) {
        matchQuery['user.age'] = {};
        if (minAge) {
            matchQuery['user.age'].$gte = minAge;
        }
        if (maxAge) {
            matchQuery['user.age'].$lte = maxAge;
        }
    }

    if (gender) {
        matchQuery['user.gender'] = gender;
    }

    if (likes && likes.length > 0) {
        matchQuery['filters.likes'] = {
            $elemMatch: {
                $in: likes
            }
        };
    }

    const tripArr = await getDb()
    .collection(COLLECTION_NAME)
    .aggregate([
        ...LOOKUP,
        ...BASE_PROJECTION,
        { $match: matchQuery }
    ])
    .toArray();

    await setUserProfilePictures(tripArr)
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
    filterTrips,
    insertTrip
}