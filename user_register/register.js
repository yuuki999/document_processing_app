const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// AWS設定
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const saltRounds = 10;

function hashPassword(password) {
  return bcrypt.hashSync(password, saltRounds);
}

// groupNameに対応する、グループがなければ作成、あればそのgroupIdを返す
async function createOrGetGroup(groupName) {
  const params = {
    TableName: 'Groups',
    IndexName: 'NameIndex',
    KeyConditionExpression: '#groupName = :groupName',
    ExpressionAttributeNames: {
      '#groupName': 'name'
    },
    ExpressionAttributeValues: {
      ':groupName': groupName
    }
  };

  try {
    const result = await dynamodb.query(params).promise();
    console.log("result");
    console.log(result);
    if (result.Items.length > 0) {
      console.log(`Group ${groupName} already exists with ID: ${result.Items[0].groupId}`);
      return result.Items[0].groupId;
    } else {
      const groupId = uuidv4();
      try {
        await dynamodb.put({
          TableName: 'Groups',
          Item: {
            groupId: groupId,
            name: groupName,
            description: `Group for ${groupName}`,
            createdAt: Date.now().toString(),
            updatedAt: Date.now().toString()
          },
          ConditionExpression: 'attribute_not_exists(groupId)'
        }).promise();
        console.log(`Created new group: ${groupName} with ID: ${groupId}`);
        return groupId;
      } catch (putError) {
        if (putError.code === 'ConditionalCheckFailedException') {
          console.log(`Concurrent creation detected for group: ${groupName}. Retrying...`);
          return createOrGetGroup(groupName); // 再帰的に再試行
        }
        throw putError;
      }
    }
  } catch (error) {
    console.error(`Error in createOrGetGroup: ${error}`);
    throw error;
  }
}
async function processUserAndGroup(user) {
  const groupId = await createOrGetGroup(user.name);
  await createUser(user, groupId);
}

async function createUser(user, groupId) {
  const userId = uuidv4();
  const params = {
    TableName: 'AdminUsers',
    Item: {
      email: user.email,
      userId: userId,
      password: hashPassword(user.password),
      name: user.name,
      groupId: groupId,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      bucketName: `user-bucket-${userId}`
    },
    ConditionExpression: 'attribute_not_exists(email)'
  };

  try {
    await dynamodb.put(params).promise();
    console.log(`Successfully added user: ${user.email} with userId: ${userId}`);
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      console.error(`User with email ${user.email} already exists.`);
    } else {
      throw error;
    }
  }
}


function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const users = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        users.push(row);
      })
      .on('end', () => {
        console.log('CSV file successfully read');
        resolve(users);
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

async function main() {
  try {
    const csvFilePath = path.join(__dirname, 'csv', 'users.csv');
    console.log(`Attempting to process CSV file: ${csvFilePath}`);

    const users = await readCSV(csvFilePath);
    for (const user of users) {
      await processUserAndGroup(user);
    }

    console.log('All users and groups have been processed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
main();
