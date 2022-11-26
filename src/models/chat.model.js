const { getDb } = require('../configs/db.config');
const {ObjectId} = require('mongodb');

const COLLECTION_NAME = process.env.CHATS_COLLECTION;
const BASE_PROJECTION = {};



const findChatById = async (chatId) => {

    const db = getDb();
    const chatId = ObjectId(chatId);
    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { _id : chatId } }
    ])
    .toArray();

    return result[0];
}

const uploadMessage = async (message) => {
    
}

module.exports = {
    findChatById
}