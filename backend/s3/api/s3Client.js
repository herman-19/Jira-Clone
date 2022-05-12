const { S3Client } = require('@aws-sdk/client-s3');
const conf = require('config');
const region = conf.get('s3.region');

// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region });

module.exports = {
    s3Client
};