const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const s3 = require('../../s3/api/s3API');

// @route  GET api/uploads/list-images-urls
// @desc   Get presigned urls for objects in S3 bucket.
// @access Private
router.get('/list-images-url', auth, async (req, res) => {
    try {
        const urls = await s3.getPresignedImagesUrls();
        res.json({urlsInfo: urls});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.");
    }
});

// @route  GET api/uploads/image-upload-url
// @desc   Get presigned url to upload an object to the S3 bucket.
// @access Private
router.get('/image-upload-url', auth, async (req, res) => {
    try {
        const url = await s3.getPresignedUploadUrl(req.session.userId);
        res.json({url});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error.');
    }
});

module.exports = router;