import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

let s3Client: S3Client | null = null;
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

async function getS3Client() {
  if (s3Client) return s3Client;

  s3Client = new S3Client({ region: process.env.AWS_REGION });
  return s3Client;
}

async function getUserBucketName(userId: string): Promise<string> {
  // ログインユーザー情報を元に、アップロード対象のS3を変更する。
  const params = {
    TableName: process.env.USERS_TABLE_NAME,
    Key: { userId: userId }
  };

  try {
    const { Item } = await docClient.send(new GetCommand(params));
    if (Item && Item.bucketName) {
      return Item.bucketName;
    } else {
      throw new Error('User or bucket information not found');
    }
  } catch (error) {
    console.error('Error retrieving user bucket information:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const userId = formData.get('userId') as string | null; // TODO: ログインするとここにユーザーIDが入る。ログイン機能はJWTで管理するか。

  if (!file || !userId) {
    return NextResponse.json({ message: 'ファイルまたはユーザーIDが提供されていません。' }, { status: 400 });
  }

  try {
    const s3 = await getS3Client();
    const bucketName = await getUserBucketName(userId);
    const buffer = await file.arrayBuffer();
    let text: string;

    if (file.type === 'application/pdf') {
      const pdfParse = await import('pdf-parse/lib/pdf-parse.js');
      const pdfData = await pdfParse.default(Buffer.from(buffer));
      text = pdfData.text;
    } else if (file.type === 'text/plain') {
      text = new TextDecoder().decode(buffer);
    } else {
      return NextResponse.json({ message: '未対応のファイル形式です。' }, { status: 400 });
    }

    const s3Key = `${userId}/${Date.now()}-${file.name}.txt`;
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: text,
      ContentType: 'text/plain'
    }));

    return NextResponse.json({ message: 'ファイルが正常に処理されました', s3Key });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ message: 'ファイルの処理中にエラーが発生しました。' }, { status: 500 });
  }
}
