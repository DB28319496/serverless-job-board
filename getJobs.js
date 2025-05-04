// getJobs.js
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
  try {
    const result = await dynamo
      .scan({
        TableName: process.env.JOBS_TABLE,
      })
      .promise();

    // Sort by postedAt descending
    const items = result.Items.sort(
      (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
    );

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not fetch jobs' }) };
  }
};
