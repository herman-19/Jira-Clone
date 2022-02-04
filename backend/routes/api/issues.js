const express = require('express');
const router = express.Router();
const conf = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const db = require('../../db/index');

// @route  GET api/issues
// @desc   Get all issues
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        // Retrieve all exisiting issues.
        const issues = await db.getIssues();
        return res.json(issues);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error.');
    }
});

// @route  GET api/issues/me
// @desc   Get all issues pertaining to user
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const issues = await db.getIssueByUserId(req.user.id);
        return res.json(issues);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error.');
    }
});

// @route  GET api/issues/:id
// @desc   Get issue by id
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const issue = await db.getIssue(req.params.id);
        return res.json(issue);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error.');
    }
});

// @route  POST api/issues
// @desc   Create a new issue
// @access Private
router.post(
    '/',
    [auth,
        [
            check('type', 'Type is a required field.').notEmpty(),
            check('status', 'Status is a required field.').notEmpty(),
            check('priority', 'Priority is a required field.').notEmpty(),
            check('title', 'Title is a required field.').notEmpty(),
            check('reporterId', 'Reporter is required.').notEmpty(),
            check('assigneeIDs', 'Assignee(s) field must be a list.').isArray({ min: 1 })
        ]
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Create issue data object.
            const issueData = {
                type: req.body.type,
                status: req.body.status,
                priority: req.body.priority,
                title: req.body.title,
                description: req.body.description,
                reporterId: req.body.reporterId,
                assigneeIDs: req.body.assigneeIDs
            };

            // Description field is not required. Set emptry string if not provided.
            if (!issueData.description) issueData.description = "";

            const row = await db.createIssue(issueData);
            console.log('New issue created:');
            console.log(row);
            return res.json(row);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error.');
        }
    }
);

// @route  PUT api/issues/:id
// @desc   Update an issue
// @access Private
router.put('/:id', auth, async (req, res) => {
    // Check if received data to update issue.
    if (Object.keys(req.body).length === 0) {
        return res.json({ msg: "No data provided." })
    }

    try {
        const query = await db.updateIssue(req.params.id, req.body);
        res.json(query);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error.');
    }
});

// @route  DELETE api/issues/:id
// @desc   Delete an issue
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedIssue = await db.deleteIssue(req.params.id);
        return res.json(deletedIssue);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error.');
    }
});

module.exports = router;