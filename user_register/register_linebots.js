const AWS = require('aws-sdk');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// AWS設定
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getGroupIdByName(groupName) {
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
    console.log('Executing DynamoDB query with params:', JSON.stringify(params, null, 2));
    const result = await dynamodb.query(params).promise();
    console.log('Query result:', JSON.stringify(result, null, 2));
    if (result.Items.length > 0) {
      return result.Items[0].groupId;
    } else {
      throw new Error(`Group not found: ${groupName}`);
    }
  } catch (error) {
    console.error(`Error in getGroupIdByName: ${error}`);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}

async function createLineBot(lineBot, groupId) {
  const params = {
    TableName: 'LineBots',
    Item: {
      lineBotId: lineBot.channelId,
      groupId: groupId,
      channelSecret: lineBot.channelSecret,
      channelAccessToken: lineBot.channelAccessToken,
      lineUserId: lineBot.lineUserId,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString()
    },
    ConditionExpression: 'attribute_not_exists(lineBotId)'
  };

  try {
    await dynamodb.put(params).promise();
    console.log(`Successfully added LineBot for groupId: ${groupId} with lineBotId: ${lineBot.channelId}`);
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      console.log(`LineBot with lineBotId ${lineBot.channelId} already exists. Skipping.`);
    } else {
      console.error(`Error creating LineBot for groupId: ${groupId}`, error);
      throw error;
    }
  }
}

async function processLineBot(lineBot) {
  try {
    if (!lineBot.groupName) {
      throw new Error('Group name is missing in the CSV data');
    }
    const groupId = await getGroupIdByName(lineBot.groupName);
    await createLineBot(lineBot, groupId);
  } catch (error) {
    console.error(`Error processing LineBot for group: ${lineBot.groupName}`, error);
  }
}

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const lineBots = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        lineBots.push(row);
      })
      .on('end', () => {
        console.log('CSV file successfully read');
        resolve(lineBots);
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

async function main() {
  try {
    // コマンドライン引数からCSVファイルのパスを取得
    const csvFilePath = process.argv[2];
    if (!csvFilePath) {
      throw new Error('Please provide the path to the CSV file as an argument.');
    }

    // 絶対パスに変換
    const absoluteCsvFilePath = path.resolve(csvFilePath);

    console.log(`Attempting to process CSV file: ${absoluteCsvFilePath}`);

    const lineBots = await readCSV(absoluteCsvFilePath);
    for (const lineBot of lineBots) {
      await processLineBot(lineBot);
    }

    console.log('All LineBots have been processed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
