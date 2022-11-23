const { ObjectId } = require("mongodb");
const { findTripById, findTrips, insertTrip, filterTrips } = require("../models/trips.model");


const getTrips = async (req, res) => {

    const matchQuery = {};

    if (req.query.stopId) {
        matchQuery.stopId = +req.query.stopId;
    }

    if (req.query.busLineId) {
        matchQuery.busLineId = +req.query.busLineId;
    }

    const result = await findTrips(matchQuery);

    if (result.success) {
        return res.status(200).json({
            success: true,
            data: result.data
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal server error.'
    });
};

const getTripById = async (req, res) => {
    const result = await findTripById(req.params.tripId);

    if (result.success) {
        return res.status(200).json({
            success: true,
            data: result.data
        });
    }

    return res.status(404).json({
        success: false,
        message: `No trip found for id ${req.params.tripId}`
    });
};

const createTrip = async ({ body }, res) => {
    const { userId, from, to, busLineId, stopId, schedule, description, filters } = body;

    if (!userId || !busLineId || !stopId || !from || !to || !schedule) {
        return res.status(400).json({
            success: false,
            message: 'Required fields missing. Required fields are: userId, busLineId, stopId, from, to, schedule'
        });
    }

    const userDoc = {
        userId: new ObjectId(userId), 
        from,
        to,
        busLineId: +busLineId,
        stopId: +stopId,
        schedule,
        description,
        filters
    };

    const result = await insertTrip(userDoc);

    if (result.success) {
        return res.status(200).json({
            success: true,
            data: result.tripId
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal server error.'
    });
}

const searchTrips = async ({ body }, res) => {

    if (!body.myAge || !body.myGender) {
        return res.status(400).json({
            success: false,
            message: 'Required fields missing. Required fields are: myAge, myGender'
        });
    }

    const matchQuery = {
        $and: [
            {
                $or: [ 
                    { 'filters.gender': { $exists: false } }, { 'filters.gender': body.myGender }
                ] 
            },
            {
                $or: [ 
                    { 'filters.ageRange.min': { $exists: false } }, { 'filters.ageRange.min': { $lte: body.myAge } }
                ]
            },
            {
                $or: [ 
                    { 'filters.ageRange.max': { $exists: false } }, { 'filters.ageRange.max': { $gte: body.myAge } }
                ]
            }
        ]
    };

    if (body.from) {
        matchQuery.from = body.from;
    }

    if (body.to) {
        matchQuery.to = body.to;
    }

    if (body.filters) {
        const { ageRange, gender, likes } = body.filters;

        if (ageRange) {
            const { min, max } = ageRange;
            matchQuery['user.age'] = {};
            if (min) {
                matchQuery['user.age'].$gte = min;
            }
            if (max) {
                matchQuery['user.age'].$lte = max;
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
    }

    const result = await filterTrips(matchQuery);

    if (result.success) {
        return res.status(200).json({
            success: true,
            data: result.data
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal server error.'
    });
};

module.exports = {
    getTrips,
    getTripById,
    createTrip,
    searchTrips
}