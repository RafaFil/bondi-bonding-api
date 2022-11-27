const { findUserChats, findChatById, uploadMessage, createAChat, deleteChatById, findChatByMembers } = require('../models/chat.model');

const getAllChats = async (req, res) => {

    const username = req.username;

    findUserChats(username).
    then( result => {
        if (result) {
            return res.status(200).json({
                success: true,
                data: result
            });
        }

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `No chats found for username ${username}`
            });
        }

    })
    .catch( err => {
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    });
}

const getChatById = async (req, res) => {

    const chatId = req.params.chatId;

    if (typeof chatId !== "string" || chatId.length !==24) {
        return res.status(400).json({
            success : false,
            message : "chatId format is not valid"
        });
    }
    
    findChatById(chatId)
    .then( result => {
        if (result) {
            return res.status(200).json({
                success: true,
                data: result
            });
        }
        if (!result) {
            return res.status(404).json({
                success: false,
                message: `Chat could not be found for id ${chatId}`
            });
        }
    })
    .catch( err => {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    })
}

const getChatByMembers = async (req, res) => {
    if (!req.body || !req.params.username) {
        return res.status(400).json({
            success: false,
            message: 'Required field missing in request body: username'
        });
    }

    const members = [ 
        req.username,
        req.params.username
    ];

    findChatByMembers(members)
    .then( result => {
        if (result) {
            return res.status(200).json({
                success: true,
                data: result
            });
        }
        if (!result) {
            return res.status(404).json({
                success: false,
                message: `No chat could be found for users ${members[0]} and ${members[1]}`
            });
        }
    })
    .catch( err => {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    })
}

const postMessageIntoChat = async (req, res) => {

    const chatId = req.params.chatId;

    if (typeof chatId !== "string" || chatId.length !==24) {
        return res.status(400).json({
            success: false,
            message: "chatId format is not valid"
        });
    }

    const { sender, message } = req.body;

    if (!sender || !message ) {
        return res.status(400).json({
            success: false,
            message: "Require fields missing. Required fields are sender, message"
        })
    }

    const msg = {
        sender : sender,
        message : message,
        date : new Date()
    }

    uploadMessage(msg, chatId)
    .then( result => {
        if (result.acknowledged){
            return res.status(200).json({
                success : true,
                data : `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s).`
            })
        }
        
        if (!result.acknowledged){
            return res.status(400).json({
                success : false,
                message : "Invalid format. Could not send message"
            })
        }
    })
    .catch( err => {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    });

}

const createChat = async(req, res) => {

    const username = req.username

    const { toUser } = req.body;

    if (!toUser){
        return res.status(400).json({
            success: false,
            message: "Missing required field 'toUser'"
        });
    }

    const chat = {
        members: [ username, toUser ],
        messages: []
    }

    createAChat(chat)
    .then( result => {
        if (result.acknowledged) {
            return res.status(200).json({
                success: true,
                data: result.insertedId
            })
        }

        if (!result.acknowledged) {
            return res.status(400).json({
                success : false,
                message : "Chat could not be created"
            })
        }
    })
    .catch( err => {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    })

}

const deleteChat = async (req, res) => {

    const chatId = req.params.chatId;
    const username = req.username;

    if (typeof chatId !== "string" || chatId.length !==24) {
        return res.status(400).json({
            success: false,
            message: "chatId format is not valid"
        });
    }

    deleteChatById(username, chatId)
    .then( result => {
        if (result.acknowledged) {
            return res.status(200).json({
                success: true,
                message: "Chat deleted successfully"
            })
        }
        if (!result.acknowledged) {
            return res.status(400).json({
                success: false,
                message: "There was an error while trying to delete the chat"
            })
        }
    })
    .catch( err => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    })
}

module.exports = {
    getAllChats,
    getChatById,
    getChatByMembers,
    postMessageIntoChat,
    createChat,
    deleteChat
}