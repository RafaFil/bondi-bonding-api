const { findChatById } = require('../models/chat.model');

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
        if (result.acknowledged) {
            return res.status(200).json({
                success: true,
                data: result
            });
        }
        if (!result.acknowledged) {
            return res.status(400).json({

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
    
}

module.exports = {
    getAllChats,
    getChatById,
    postMessageIntoChat
}