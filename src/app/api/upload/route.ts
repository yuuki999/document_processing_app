import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.BUCKET_NAME || 'your-bucket-name';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  console.log('Using bucket:', BUCKET_NAME);
  console.log('Using region:', process.env.AWS_REGION);

  if (!file) {
    return NextResponse.json({ message: 'ファイルがアップロードされていません。' }, { status: 400 });
  }

  try {
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

    const s3Key = `${Date.now()}-${file.name}.txt`;
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
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
