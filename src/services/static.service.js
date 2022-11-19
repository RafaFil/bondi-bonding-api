const dbo = require('../configs/db.config');
const dbConnect = dbo.getDb();

async function getByType(type){
    return (await dbConnect)
    .collection(process.env.STATIC)
    .aggregate([
        {$match : { type : `${type}`}},
        {$project: {"_id": 0,"type":0}}
    ])
    .toArray();
}

module.exports = {
    getByType
}