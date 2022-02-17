// Middlware function used to protect routes.
module.exports = (req, res, next) => {
    // Check for cookie.
    if (req.session.userId) {
        console.log(`Auth middleware: Cookie sent by client ${req.session.email}`);
        console.log(req.session);
        next();
    }
    else {
        console.log('Auth middleware: No cookie found.');
        return res
            .status(401)
            .json({ msg: 'Authorization Denied.' });
    }
};