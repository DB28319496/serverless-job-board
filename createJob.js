// createJob.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { title, company, location, description, applyUrl } = JSON.parse(event.body);
    if (!title || !company || !location || !description || !applyUrl) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const newItem = {
      jobId:     uuidv4(),
      title,
      company,
      location,
      description,
      applyUrl,
      postedAt: new Date().toISOString(),
    };

    await dynamo
      .put({
        TableName: process.env.JOBS_TABLE,
        Item: newItem,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(newItem),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not create job' }) };
  }
};
