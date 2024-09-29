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

async function uploadUserToDynamoDB(user) {
  const userId = uuidv4();
  const params = {
    TableName: 'AdminUsers',
    Item: {
      email: user.email,
      userId: userId,
      password: hashPassword(user.password),
      name: user.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      bucketName: `user-bucket-${userId}`
    },
    ConditionExpression: 'attribute_not_exists(email)' // 同じemailで重複登録を防ぐ
  };

  try {
    await dynamodb.put(params).promise();
    console.log(`Successfully added user: ${user.email} with userId: ${userId}`);
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      console.error(`User with email ${user.email} already exists.`);
    } else {
      console.error(`Error adding user ${user.email}:`, error);
    }
  }
}

async function processCSV(filePath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        uploadUserToDynamoDB(row);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve();
      })
      .on('error', (error) => {
        console.error('Error processing CSV file:', error);
        reject(error);
      });
  });
}

async function main() {
  try {
    // CSVファイルの絶対パスを指定
    const csvFilePath = path.join(__dirname, 'csv', 'users.csv');
    console.log(`Attempting to process CSV file: ${csvFilePath}`);

    await processCSV(csvFilePath);
    console.log('All users have been processed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// スクリプトの実行
main();
