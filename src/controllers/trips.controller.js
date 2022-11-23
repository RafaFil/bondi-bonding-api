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

    const params = {
        myAge: body.myAge,
        myGender: body.myGender,
        from: body.from,
        to: body.to,
        minAge: body.filters?.ageRange?.min,
        maxAge: body.filters?.ageRange?.max,
        gender: body.filters?.gender,
        likes: body.filters?.likes
    };

    console.log(params);
    const result = await filterTrips(params);

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