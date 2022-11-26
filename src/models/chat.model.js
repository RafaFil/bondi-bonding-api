const { getDb } = require('../configs/db.config');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = process.env.CHATS_COLLECTION;
const BASE_PROJECTION = {};



const findChatById = async (chatId) => {

    const db = getDb();
    const chatObjId = ObjectId(chatId);
    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { _id : chatObjId } }
    ])
    .toArray();

    return result[0];
}

const uploadMessage = async (message, chatId) => {

    const db = getDb();
    const chatObjId = ObjectId(chatId);
    const result = await db.collection(COLLECTION_NAME)
    .updateOne(
        { _id: chatObjId },
        { $push: {
            messages : message
            }
        }
    );
    console.log(result);
    return result;
}

module.exports = {
    findChatById,
    uploadMessage
}