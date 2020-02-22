# 教材パターン

## Slide

### 表紙

- コース名 `string`
- レッスン名 `string`
- 組織名 `string`
- 著者名 `string`

### 1 カラム

- タイトル `string`
- 本文 `SlideElement[]`

### 2 カラム

- タイトル `string`
- 本文左側 `SlideElement[]`
- 本文右側 `SlideElement[]`

### 用語/概念

- タイトル `string`
- 本文左側 `SlideElement[]`
- 本文右側 `SlideElement[]`

## SlideElement

### 段落

- 本文 `string`: 複数行のプレーンテキスト

### 画像

- 画像パス `string`: ファイルの場所
- 縦 `number`: optional
- 横 `number`: optional
- 代替テキスト `string`: `<img>`の`alt`属性にあたる

### コード

表示用のソースコード

- lang `string`: 使用言語
- code `string`: ソースコード
- fontSize `number`: optional

### n 択クイズ

- title `string`: 質問文
- answer `number`: 答え Index
- options `string[]`: 解答候補
- shuffle `boolean`: 順序シャッフルをするか

### 穴埋め

- lang `string`: 使用言語
- code `string`: ソースコード
- blanks `BlankType[]`

#### BlankType

- size `number`: 入力欄の幅
- type `string`: 正誤チェックのタイプ。現在`'equalTo'`
- values `string[]`: `'equalTo'`のとき、いずれかに一致すれば正解
