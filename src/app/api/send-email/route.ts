import { NextRequest, NextResponse } from 'next/server';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const isDevelopment = process.env.NODE_ENV === 'development';

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません。`);
  }
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { name, email, phone, message } = formData;

    // 管理者（あなた）への通知メール
    const adminEmail = isDevelopment ? getEnvVariable('MY_TEST_EMAIL_ADDRESS') : getEnvVariable('MY_EMAIL_ADDRESS');
    await resend.emails.send({
      from: isDevelopment ? 'onboarding@resend.dev' : 'noreply@yuki-engineer.com',
      to: adminEmail,
      subject: 'SmartReplyから新しいお問い合わせがありました',
      html: `
        <h1>新しいお問い合わせ</h1>
        <p><strong>名前:</strong> ${name}</p>
        <p><strong>メール:</strong> ${email}</p>
        <p><strong>電話番号:</strong> ${phone || 'なし'}</p>
        <p><strong>メッセージ:</strong> ${message}</p>
      `
    });

    // ユーザーへの自動返信メール
    await resend.emails.send({
      from: isDevelopment ? 'onboarding@resend.dev' : 'noreply@yuki-engineer.com',
      to: email,
      subject: 'お問い合わせありがとうございます',
      html: `
        <h1>${name}様</h1>
        <p>お問い合わせいただき、ありがとうございます。<br/>
        内容を確認の上、担当者より折り返しご連絡させていただきます。<br/>
        今しばらくお待ちくださいますようお願い申し上げます。</p>
        <br/>
        <p>SmartReply<br/>
        Yuki Itoi</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('メール送信エラー:', error);
    if (error instanceof Error && error.message.includes('環境変数')) {
      return NextResponse.json({ success: false, error: '設定エラーが発生しました。管理者に連絡してください。' }, { status: 500 });
    }

    return NextResponse.json({ success: false, error: 'メールの送信に失敗しました。' }, { status: 500 });
  }
}
