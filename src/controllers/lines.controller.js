const { getDb } = require("../configs/db.config");

const COLLECTION_NAME = process.env.LINES_COLLECTION;
const BASE_PROJECTION_STAGE = {
    $project: { _id: 0, busstopIds: 0 }
};

const getLines = async (req, res) => {
    const db = await getDb();

    const aggregateQuery = [ BASE_PROJECTION_STAGE ];
    if (req.query.stopId) {
        if (isNaN(req.query.stopId)) {
            return res.status(400).json({
                success: false,
                message: `${req.query.stopId} is not a valid number.`
            });
        }

        aggregateQuery.unshift(
            {
                $lookup: {
                    from: "bus_stops",
                    localField: "lineId",
                    foreignField: "lineIds",
                    as: "stop"
                }
            },
            {
                $match: { "stop.busstopId": +req.query.stopId }
            },
        );
        aggregateQuery[aggregateQuery.length - 1].$project.stop = 0;
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

const getLineById = async (req, res) => {
    const db = await getDb();

    const { lineId } = req.params;

    if (isNaN(lineId)) {
        return res.status(400).json({
            success: false,
            message: `${lineId} is not a valid number.`
        });
    }

    db.collection(COLLECTION_NAME)
    .aggregate([
        {
            $match: { lineId: +lineId }
        },
        BASE_PROJECTION_STAGE
    ]).toArray()
    .then(result => {
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No line was found for id ${lineId}`
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
    getLines,
    getLineById
}