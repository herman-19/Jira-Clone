// Middlware function used to protect routes.
module.exports = (req, res, next) => {
    // Check for cookie.
    if (req.session.userId) {
        next();
    }
    else {
        return res
            .status(401)
            .json({ msg: 'Authorization Denied.' });
    }
};