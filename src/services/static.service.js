/*const dbo = require('../configs/db.config');
const dbConnect = await dbo.getDb();*/
const { getDb } = require('../configs/db.config');
const dbConnect = await getDb();

async function getByType(type){
    return await dbConnect
    .collection(process.env.STATIC_COLLECTION)
    .aggregate([
        { $match : { type : type } },
        { $project: { _id: 0, type: 0 } }
    ])
    .toArray();
}

module.exports = {
    getByType
}