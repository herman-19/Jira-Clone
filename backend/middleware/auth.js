const jwt = require('jsonwebtoken');
const config = require('config');

// Middlware function used to protect routes.
module.exports = (req, res, next) => {
    // Extract the token from the header.
    const token = req.header('x-auth-token');

    // Check and verify token.
    if (!token) {
        return res
            .status(401)
            .json({ msg: 'Authorization Denied: missing token.' });
    }

    try {
        // Set the user in the request to the user indicated by the token.
        const decodedToken = jwt.verify(token, config.get('jwtSecret'));
        req.user = decodedToken.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token.' });
    }
};
