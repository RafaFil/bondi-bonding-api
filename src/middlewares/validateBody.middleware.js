const validateBody = async (req, res, next) => {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Body is empty"
        });
    }
    return next();
}

module.exports = {
    validateBody
}