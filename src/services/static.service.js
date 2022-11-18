const dbo = require('../configs/db.config');
const dbConnect = dbo.getDb();

async function getAllFaqs(){

    return (await dbConnect)
            .collection(process.env.STATIC)
            .aggregate([
                {$match : { type : "faq"}},
                {$project: {"_id": 0,"type":0}}
            ]
            )
            .toArray();
}

async function getAllToS(){

    return (await dbConnect)
        .collection(process.env.STATIC)
        .aggregate([
            {$match : { type : "text"}},
            {$project: {"_id": 0,"type":0}}
        ])
        .toArray();
}

module.exports = {
    getAllFaqs,
    getAllToS
}