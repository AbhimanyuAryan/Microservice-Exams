const { validationResult } = require('express-validator');

const handleBadRequest = (req, res, next, route) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "message": "Missing parameters or unexpected parameters values." });
    } else next();
}

module.exports = { handleBadRequest };