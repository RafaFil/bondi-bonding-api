const { Router } = require("express");
const { getPicture, postPicture } = require("../controllers/profilePicture.controller");
const multer = require('multer');
const { validateJWT } = require("../middlewares/validateJWT.middleware");

const BASE_ROUTE = '/profilePicture';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const profilePictureRouter = Router();

profilePictureRouter.use(validateJWT);

profilePictureRouter.get(`${BASE_ROUTE}/:picKey`, async (req, res) => {
    return await getPicture(req, res);
});

profilePictureRouter.post(BASE_ROUTE, upload.single('file'), async (req, res) => {
    return await postPicture(req, res);
});

module.exports = profilePictureRouter;