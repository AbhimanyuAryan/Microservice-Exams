const jwt = require('jsonwebtoken');

const secretKey = 'RAS';

function verifyToken(req, res, next) {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    if (!token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Wrong token format' });
    }

    token = token.slice(7)

    return new Promise((resolve, reject) => {
        jwt.verify(token, "RAS", (err, decoded) => {
            if (err) {
                console.log(token)

                reject({ status: 401, message: 'Unauthorized: Invalid token' });
            } else {
                req.user = decoded; // Attach decoded user information to the request object
                resolve();
            }
        });
    }).then(() => {
        next();
    }).catch((error) => {
        res.status(error.status).json({ message: error.message });
    });
}

module.exports = { verifyToken };
