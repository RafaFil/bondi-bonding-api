const { findUserChats, findChatById, uploadMessage, createChat, deleteChatById } = require('../models/chat.model');

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
            return res.status(200).json({
                success: true,
                message: 'Couldnt get the chats'
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
            message : "chat_id format is not valid"
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
            return res.status(400).json({
                success: false,
                message: "chat couldnt be found"
            });
        }
    })
    .catch( err => {
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    })
}

const postMessageIntoChat = async (req, res) => {

    const chatId = req.params.chatId;

    if (typeof chatId !== "string" || chatId.length !==24) {
        return res.status(400).json({
            success : false,
            message : "chat_id format is not valid"
        });
    }

    const { sender, message } = req.body;

    if (!sender || !message ) {
        return res.status(400).json({
            success: false,
            message: "Require fields: sender and message"
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
                data : "Message sent"
            })
        }
        
        if (!result.acknowledged){
            return res.status(400).json({
                success : false,
                data : "Couldn´t send message"
            })
        }
    })
    .catch( err => {
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    });

}

const startChat = async(req, res) => {

    const user = req.username

    const { user2 } = req.body;

    if (!user2){
        return res.status(400).json({
            success : false,
            message : "there is no user to start a chat"
        });
    }

    const chat = {
        members : [username, user2],
        messages : []
    }

    createChat(chat)
    .then( result => {

    })
    .catch( err => {
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    })

}

const deleteChat = async (req, res) => {

    const chatId = req.params.chatId;

    if (typeof chatId !== "string" || chatId.length !==24) {
        return res.status(400).json({
            success : false,
            message : "chat_id format is not valid"
        });
    }

    deleteChatById(chatId)
    .then( result => {
        if (result.acknowledged) {
            return res.status(200).json({
                success : true,
                message : "Chat message"
            })
        }
        if (!result.acknowledged) {
            return res.status(400).json({
                success : false,
                message : "There was an error while trying to delete the chat"
            })
        }
    })
    .catch( err => {
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    })
}

module.exports = {
    getAllChats,
    getChatById,
    postMessageIntoChat,
    startChat,
    deleteChat
}