const { findChatById, uploadMessage } = require('../models/chat.model');

const getAllChats = async (req, res) => {

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

module.exports = {
    getAllChats,
    getChatById,
    postMessageIntoChat
}