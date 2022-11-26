const { getDb } = require('../configs/db.config');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = process.env.CHATS_COLLECTION;


const findUserChats = async (username) => {

    const PROJECTION = {
        _id : 1,
        members: 1,
        messages: { $slice: [ "$messages", -1 ] }
    };

    console.log(username)
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { members : "shaDav" } },
        { $project: {
            _id : 1,
            members: 1,
            messages: { $slice: [ "$messages", -1 ] }
            }
        }]
    ).toArray();

    return result[0]
}

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
    findUserChats,
    findChatById,
    uploadMessage
}