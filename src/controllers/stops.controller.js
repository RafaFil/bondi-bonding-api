const { getDb } = require("../configs/db.config");

const COLLECTION_NAME = process.env.STOPS_COLLECTION;
const DEFAULT_MAX_DISTANCE_METERS = 2000;
const DEFAULT_MIN_DISTANCE_METERS = 0;
const BASE_PROJECTION_STAGE = {
    $project: { _id: 0 }
};

const getStops = async (req, res) => {
    const db = getDb();

    db.collection(COLLECTION_NAME)
        .aggregate([
            BASE_PROJECTION_STAGE
        ]).toArray()
        .then(result => {
            return res.status(200).json({
                success: true,
                data: result
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: `Internal server error.`
            });
        });
};

const getStopsGeo = async (req, res) => {
    const db = getDb();

    const { long, lat, minDist, maxDist, minLines } = req.query;

    if (!long || !lat) {
        return res.status(400).json({
            success: false,
            message: 'No coordinates were provided'
        });
    }
    const coordinates = [+long, +lat];
    const minDistance = minDist ? +minDist : DEFAULT_MIN_DISTANCE_METERS;
    const maxDistance = maxDist ? +maxDist : DEFAULT_MAX_DISTANCE_METERS;

    const aggregateQuery = [
        {
            $geoNear: {
                distanceField: "distance",
                spherical: true,
                near: { type: "Point", coordinates },
                maxDistance: maxDistance,
                minDistance: minDistance
            }
        },
        BASE_PROJECTION_STAGE
    ];

    if (!isNaN(minLines)) {
        aggregateQuery.push(
            {
                $match: {
                    $expr: {
                        $gte: [
                            {
                                $size: {
                                    "$ifNull": ["$lineIds", []]
                                }
                            },
                            +minLines
                        ]
                    }
                }
            }
        );
    }

    db.collection(COLLECTION_NAME)
        .aggregate(aggregateQuery)
        .toArray()
        .then(result => {
            return res.status(200).json({
                success: true,
                data: result
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: `Internal server error.`
            });
        });
};

const getStopById = async (req, res) => {
    const db = getDb();

    const { stopId } = req.params;

    if (isNaN(stopId)) {
        return res.status(400).json({
            success: false,
            message: `${stopId} is not a valid number.`
        });
    }

    db.collection(COLLECTION_NAME)
        .aggregate([
            {
                $match: { busstopId: +stopId }
            },
            BASE_PROJECTION_STAGE
        ]).toArray()
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `No stop was found for id ${stopId}`
                });
            }

            return res.status(200).json({
                success: true,
                data: result[0]
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: `Internal server error.`
            });
        });
};

module.exports = {
    getStops,
    getStopsGeo,
    getStopById
}