const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3Client } = require('./s3Client');
const { PutObjectCommand, GetObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
const conf = require('config');
const bucket = conf.get('s3.bucket');

const getPresignedUploadUrl = async (key) => {
    try {
        const bucketParams = {
            Bucket: bucket,
            Key: key.toString(),
            ContentType: 'image/*'
        };
        // Create a command to put the object in the S3 bucket.
        const command = new PutObjectCommand(bucketParams);
        // Create the presigned URL.
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return url;
      } catch (err) {
        console.log('Error', err);
        res.status(500).send("Server Error.");
      }
};

const getPresignedImagesUrls = async () => {
    try {
        // Retrieve list of objects (images) stored in bucket.
        const data = await s3Client.send(new ListObjectsCommand({
            Bucket: bucket
        }));

        // Iterate through list of contents and create presigned urls for each
        // to send to client to enable direct access to images.
        const presignedImgsUrls = await Promise.all(data.Contents.map(async (image) => {
            try {
                const bucketParams = {
                    Bucket: bucket,
                    Key: image.Key,
                };
                const command = new GetObjectCommand(bucketParams);
                const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                return {userId: image.Key, url};
            } catch (error) {
                throw error;
            }
        }));
        return presignedImgsUrls;
      } catch (err) {
        console.log('Error', err);
        res.status(500).send("Server Error.");
      }
};

module.exports = {
    getPresignedUploadUrl,
    getPresignedImagesUrls
};