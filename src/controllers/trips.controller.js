const { findTripById, findTrips, insertTrip } = require("../models/trips.model");


const getTrips = async (req, res) => {
    const trips = await findTrips();

    if (trips.success) {
        return res.status(200).json({
            success: true,
            data: trips.data
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal server error.'
    });
};

const getTripById = async (req, res) => {
    const trip = await findTripById(req.params.tripId);

    if (trip.success) {
        return res.status(200).json({
            success: true,
            data: trip.data
        });
    }

    return res.status(404).json({
        success: false,
        message: `No trip found for id ${req.params.tripId}`
    });
};

const createTrip = async ({ body }, res) => {
    const { userId, from, to, busLineId, stopId, schedule, description, filters } = body;

    const userDoc = {
        userId, 
        from, 
        to, 
        busLineId, 
        stopId, 
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

module.exports = {
    getTrips,
    getTripById,
    createTrip
}