const { getDb } = require('../configs/db.config');
const { ObjectId } = require('mongodb');
const { setProfilePicture } = require('../helpers/profileIcon.helper');

const COLLECTION_NAME = process.env.CHATS_COLLECTION;
const DEFAULT_PIPELINE = [
    { $lookup: {
        from: process.env.USERS_COLLECTION,
        localField: "members",
        foreignField: "username",
        as: "members"
    } },
    { $unset: [ "members._id", "members.hashpwd", "members.recoveryCode", "members.recoveryCodeExpireTime" ] }
];

const findUserChats = async (username) => {

    const db = getDb();
    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { members : username } },
        ...DEFAULT_PIPELINE,
        { $project: {
                _id: 1,
                members: 1,
                messages: { $slice: [ "$messages", -1 ] },
            }
        }]
    ).toArray();

    for (const res of result) {
        if (!res.members || !res.members.length > 0) {
            continue;
        }
        for (let i = 0; i < res.members.length; i++) {
            res.members[i] = await setProfilePicture(res.members[i]);
        }
    }

    return result;
}

const findChatById = async (chatId) => {

    const db = getDb();
    const chatObjId = ObjectId(chatId);
    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { _id : chatObjId } },
        ...DEFAULT_PIPELINE
    ])
    .toArray();

    return result[0];
}

const findChatByMembers = async (members) => {

    const db = getDb();
    const result = await db.collection(COLLECTION_NAME)
    .aggregate([
        { $match: { members: { $all: members } } },
        ...DEFAULT_PIPELINE    
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

    return result;
}

const createAChat = async (chat) => {

    const db = getDb();
    const result = await db.collection(COLLECTION_NAME)
    .insertOne(chat)

    return result;

}

const deleteChatById = async (username,chatId) => {
    const db = getDb();
    const chatObjId = ObjectId(chatId);
    const result = await db.collection(COLLECTION_NAME)
    .deleteOne(
        { _id: chatObjId, members: username }
    );
    
    return result;
}

module.exports = {
    findUserChats,
    findChatById,
    findChatByMembers,
    uploadMessage,
    createAChat,
    deleteChatById
}