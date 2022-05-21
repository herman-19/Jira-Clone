const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../../db/index');
const auth = require('../../middleware/auth');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post(
    '/register',
    [
        check('name', 'Name is required.').not().isEmpty(),
        check('email', 'Please provide a valid email.').isEmail(),
        check('password', 'Password must be 8 or more characters.').isLength({
            min: 8,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructure request body to extract required fields.
        const { name, email, password } = req.body;
        try {
            // Check if user already exists.
            let user = await db.getUserByEmail(email);
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'This account already exists.' }] });
            }

            // If user does not exist, hash password and create user.
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = await db.createUser(name, email, hashedPassword);

            // Populate session object and save in store.
            req.session.userId = user.person_id;
            req.session.email = user.email;
            res.status(200).json({ person_id: user.person_id});
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error.');
        }
    }
);

// @route   POST api/users/login
// @desc    Authenticate user--i.e., user login
// @access  Public
router.post(
    '/login',
    [
        check('email', 'Please provide a valid email.').isEmail(),
        check('password', 'Password required.').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructure request body.
        const { email, password } = req.body;
        try {
            // Check if user exists.
            const user = await db.getUserByEmail(email);
            if (!user) {
                return res
                    .status(401)
                    .json({ errors: [{ msg: 'Invalid credentials' }] });
            }

            // Check for password match between raw password and stored password.
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ errors: [{ msg: 'Invalid credentials.' }] });
            }

            // Populate session object and save in store.
            req.session.userId = user.person_id;
            req.session.email = user.email;

            console.log(`User login: ${req.session.email}`);
            res.status(200).json({ person_id: user.person_id});
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error.');
        }
    }
);

// @route   GET api/users/logout
// @desc    Logout the current user
// @access  Private
router.get('/logout', auth, (req, res) => {
    console.log(`User logout: ${req.session.email}`);
    req.session.destroy();
    res.status(200).send('Logged out.');
});

// @route   GET api/users/current
// @desc    Return the current user
// @access  Private
router.get('/current', auth, async (req, res) => {
    try {
        const user = await db.getUser(req.session.userId);
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.");
    }
});

// @route   GET api/users
// @desc    Return all the users or users pertaining to
//          an issue if query parameter is specified.
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const issueId = req.query.issueId;
        if (issueId) {
            const users = await db.getUsersForIssue(issueId);
            return res.json(users);
        } else {
            const users = await db.getUsers();
            return res.json(users);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.");
    }
});

// @route   UPDATE api/users
// @desc    UPDATE user information
// @access  Private
router.put('/', auth, async (req, res) => {
    try {
        // name, email, password
        const { name, password } = req.body;
        if ((name === undefined) && (password === undefined)) {
            return res.json({ msg: "No fields provided for update." });
        }

        const user = await db.updateUser(req.session.userId, name, password);
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.");
    }
});

// @route   DELETE api/users
// @desc    DELETE user
// @access  Private
router.delete("/", auth, async (req, res) => {
    try {
        // Delete user and related entries in other tables.
        await db.deleteUser(req.session.userId);
        res.json({ msg: "User deleted." });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.");
    }
});

module.exports = router;