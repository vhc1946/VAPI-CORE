
var {PutObjectCommand, CreateBucketCommand}= require('@aws-sdk/client-s3');
var {s3Client}=require('./libs/sampleClient.js');

// Set the parameters
const params = {
  Bucket: "BUCKET_NAME", // The name of the bucket. For example, 'sample_bucket_101'.
  Key: "sample_upload.txt", // The name of the object. For example, 'sample_upload.txt'.
  Body: "BODY", // The content of the object. For example, 'Hello world!".
};

const tparams={Bucket:'vogelbucket'}
const run = async () => {
  // Create an Amazon S3 bucket.
  try {
    const data = await s3Client.send(
        new PutObjectCommand({ Bucket: tparams.Bucket , Key: './store/apps/REPORTING/tech_reports.db'})
    );
    console.log(data);
    console.log("Successfully created a bucket called ", data.Location);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
run()
