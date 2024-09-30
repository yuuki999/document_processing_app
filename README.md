サーバー起動
```
pnpm run dev
```

DynamoDBにユーザーデータを登録する方法
1. CSVにユーザー情報を記載する。
1. コマンドを実行する。
```
AWS_PROFILE=itoi node ./user_register/register.js
```


開発環境が重くなった時に試してみること
```
# .nextフォルダを削除
rm -rf .next

# node_modulesを削除
rm -rf node_modules

# pnpmのキャッシュをクリア
pnpm store prune

# 依存関係を再インストール
pnpm install

# 開発サーバーを再起動
pnpm run dev
```

重くなっている原因を調査する
```
pnpm run build:trace
```


TODO:
- bedrockのモデルを会社ごとにファインチューニングできるかどうか調査。
- 画面ローディング直後にヘッダーが初期状態が見えるので回避する。
