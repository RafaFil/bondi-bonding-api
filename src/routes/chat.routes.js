const { Router } = require("express");
const { getAllChats, getChatById, postMessageIntoChat } = require('../controllers/chat.controller');

const BASE_ROUTE = '/chat';
const chatRouter = Router();

//Get all user chat
chatRouter.get(BASE_ROUTE, async (req, res) => {

});

//Get a chat by chatId
chatRouter.get(`${BASE_ROUTE}/:chatId`, async (req, res) => {
    return getChatById(req, res);
});

//Post a message into a chat
chatRouter.post(`${BASE_ROUTE}/:chatId`, async (req, res) => {
    return postMessageIntoChat(req, res);
});

module.exports = chatRouter;