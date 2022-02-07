const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const db = require('../../db/index');


// @route  GET api/comments
// @desc   Get all comments
// @access Private
router.get('/', auth, async (req, res) => {
    const comments = await db.getComments();
    return res.json(comments);
});

// @route  GET api/comments/:id
// @desc   Get comment by id
// @access Private
router.get('/:id', auth, async (req, res) => {
    const comment = await db.getComment(req.params.id);
    return res.json(comment);
});

// @route  POST api/comments
// @desc   Create a new comment
// @access Private
router.post(
    '/',
    [
        auth,
        [
            check('issueId').notEmpty(),
            check('content').notEmpty()
        ]
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Create comment object.
            const commentData = {
                personId: req.user.id,
                issueId: req.body.issueId,
                content: req.body.content
            };

            const comment = await db.createComment(commentData);
            console.log('New comment created:');
            console.log(comment);
            return res.json(comment);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error.');
        }
    }
);

// @route  PUT api/comments/:id
// @desc   Update a comment
// @access Private
router.put(
    '/:id',
    [
        auth,
        [
            check('content').notEmpty()
        ]
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // User should only be able to update own comments.
            // Check if comment being updated is owned by current user.
            const comment = await db.getComment(req.params.id);
            if (req.user.id !== comment.person_id) {
                return res.status(400).json({ errors: [{ msg: 'Cannot update comment of other user.' }] });
            }

            const { content } = req.body;
            const updatedComment = await db.updateComment(req.params.id, content);
            res.json(updatedComment);
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error.');
        }
    }
);

// @route  DELETE api/comments/:id
// @desc   Delete a comment
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // User should only be able to delete own comments.
        // Check if comment being deleted is owned by current user.
        const comment = await db.getComment(req.params.id);
        if (req.user.id !== comment.person_id) {
            return res.status(400).json({ errors: [{ msg: 'Cannot delete comment of other user.' }] });
        }

        const deletedComment = await db.deleteComment(req.params.id);
        res.json(deletedComment);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error.');
    }
});

module.exports = router;