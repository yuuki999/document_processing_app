import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  // TODO: 本来ならCookieにセッションIDを保持して、IDの値を元にサーバーサイドのセッションからJWTを取得して検証する方がセキュアで一般的。
  // だが、JWTが検証ツールで閲覧できてもJWT自体が秘密鍵で署名されているため、悪用されるリスクはかなり低い。
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ isLoggedIn: false });
  }

  try {
    // JWTの検証
    // ・トークンの署名が正しいか
    // ・トークンが期限切れでないか
    // ・トークンがまだ有効でないという状態ではないか
    verify(token, process.env.JWT_SECRET as string);
    return NextResponse.json({ isLoggedIn: true });
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ isLoggedIn: false });
  }
}
