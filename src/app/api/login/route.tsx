import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// TODO: ブルートフォース対策をする。
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'メールアドレスとパスワードは必須です。' }, { status: 400 });
  }

  try {
    const params = {
      TableName: process.env.USERS_TABLE_NAME,
      Key: { email: email }
    };

    const { Item } = await docClient.send(new GetCommand(params));

    if (!Item) {
      return NextResponse.json({ message: 'ユーザーが見つかりません。' }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, Item.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: 'パスワードが正しくありません。' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: Item.userId, email: Item.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({ message: 'ログインに成功しました。', token });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'ログイン処理中にエラーが発生しました。' }, { status: 500 });
  }
}
