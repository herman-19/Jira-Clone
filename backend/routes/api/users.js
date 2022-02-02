const express = require('express');
const conf = require('config');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail, getUser } = require('../../db/index');
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
            let user = await getUserByEmail(email);
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exists.' }] });
            }

            // If user does not exist, hash password and create user.
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = await createUser(name, email, hashedPassword);

            // Return jsonwebtoken so user is logged in after registration.
            const payload = {
                user: {
                    id: user.person_id,
                    email: user.email
                },
            };

            // Sign the payload into the JSON web token and return it to client.
            jwt.sign(
                payload,
                conf.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    console.log(`User created: ${name}!`);
                    res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error.');
        }
    }
);

// @route   POST api/users/login
// @desc    Authenticate user and get token--i.e., user login.
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
            const user = await getUserByEmail(email);
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid credentials' }] });
            }

            // Check for password match between raw password and stored password.
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid credentials.' }] });
            }

            // Return jsonwebtoken for user login.
            const payload = {
                user: {
                    id: user.person_id,
                    email: user.email
                },
            };

            // Sign the payload into the JSON web token and return it to client.
            jwt.sign(
                payload,
                conf.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error.');
        }
    }
);

// @route   GET api/users/current
// @desc    Return the current user based on token.
// @access  Public
router.get('/current', auth, async (req, res) => {
    const user = await getUser(req.user.id);
    res.json(user);
});

module.exports = router;