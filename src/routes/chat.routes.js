const { Router } = require("express");
const { getAllChats, getChatById,
        postMessageIntoChat, createChat, deleteChat, getChatByMembers } = require('../controllers/chat.controller');
const { validateJWT } = require('../middlewares/validateJWT.middleware');

const BASE_ROUTE = '/chat';
const chatRouter = Router();
chatRouter.use(BASE_ROUTE, validateJWT);

//Get all user chat
chatRouter.get(BASE_ROUTE, async (req, res) => {
    return getAllChats(req, res);
});

//Get a chat by chatId
chatRouter.get(`${BASE_ROUTE}/:chatId`, async (req, res) => {
    return getChatById(req, res);
});

//Get a chat by chatId
chatRouter.get(`${BASE_ROUTE}/member/:username`, async (req, res) => {
    return getChatByMembers(req, res);
});

//Post a message into a chat
chatRouter.post(`${BASE_ROUTE}/:chatId`, async (req, res) => {
    return postMessageIntoChat(req, res);
});

//start a chat with a user
chatRouter.post(BASE_ROUTE, async (req, res) => {
    return createChat(req, res);
});

//delete a chat
chatRouter.delete(`${BASE_ROUTE}/:chatId`, async (req, res) => {
    return deleteChat(req, res);
});

module.exports = chatRouter;