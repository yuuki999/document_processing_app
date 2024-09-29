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


TODO:
bedrockのモデルを会社ごとにファインチューニングできるかどうか調査。
