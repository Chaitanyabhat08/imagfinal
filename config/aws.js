const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIAZVTLPFXVZNC2NNFL',
  secretAccessKey: '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',
  region: 'Asia Pacific (Mumbai) ap-south-1',
});

const s3 = new AWS.S3();
module.exports = s3;
