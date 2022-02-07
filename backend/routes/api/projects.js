const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const db = require('../../db/index');

// @route  GET api/projects
// @desc   Get all projects
// @access Private
router.get('/', auth, async (req, res) => {
    const project = await db.getProject();
    return res.json(project);
});

// @route  PUT api/projects
// @desc   Update project information
// @access Private
router.put('/', auth, async (req, res) => {
    // Check if received data to update issue.
    if (Object.keys(req.body).length === 0) {
        return res.json({ msg: "No data provided." })
    }

    const projectData = {
        name: req.body.name,
        url: req.body.url,
        category: req.body.category,
        description: req.body.description
    };

    try {
        // Hardcode project id for now.
        const project = await db.updateProject(1, projectData);
        res.json(project);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error.');
    }
});

module.exports = router;