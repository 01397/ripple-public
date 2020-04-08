interface Exception {
  name: string
  message: string
  stack: Stack[]
  lastLineNo: number
}
interface Stack {
  filename: string
  lineno: number
  name: string
}
export interface ExceptionGuide {
  title: string
  solution: string
  error: Exception
}

export function translate(input: string) {
  if (!input) return null
  const error = parseError(input)
  return translateDescription(error)
}
function parseError(input: string): Exception | null {
  const lines = input.split('\n').filter((val) => val !== '')
  const lastLine = lines[lines.length - 1]
  const name = lastLine.match(/^[^:\W]+/)?.[0] ?? ''
  const message = lastLine.match(/:.+$/)?.[0]?.slice(2) ?? ''
  const traceback = parseTraceback(input)
  return { name, message, ...traceback }
}
function translateDescription(err: Exception): ExceptionGuide {
  let title = `エラー(${err.name})`
  let solution = err.lastLineNo + 1 + '行目付近を確認してみてください'
  switch (err.name) {
    case 'AttributeError':
      const a = err.message.match(/'(.+)' object has no attribute '(.+)'/)
      if (a) {
        title = `${a[1]}には属性「${a[2]}」は存在しません。`
        solution = `${a[2]}のスペルを確認しましょう`
        break
      }
      title = 'input()が入力を受け取れませんでした。'
      solution = '入力の数と、受け取るinput()の数が一致しているか確認しましょう。'
      break
    case 'EOFError':
      title = 'input()が入力を受け取れませんでした。'
      solution = '入力の数と、受け取るinput()の数が一致しているか確認しましょう。'
      break
    case 'FileNotFoundError':
      title = 'ファイルが見つかりませんでした。'
      solution = 'ファイルの名前を確認しましょう。ファイルが存在しない場合もあります。'
      break
    case 'ImportError':
      title = 'モジュールがインポートできませんでした。'
      solution = 'importに続くスペルを確認してみましょう。'
      break
    case 'IndexError':
      title = '範囲外のインデックス番号が使用されました。'
      solution = 'インデックス番号がリストや文字列の長さを超えていないか確認しましょう。'
      break
    case 'IndentationError':
      if (err.message.includes('unexpected indent')) {
        title = '不必要なインデントがあります。'
      } else if (err.message.includes('unindent does not match any outer indentation level')) {
        title = 'インデントがずれています。'
      } else if (err.message.includes('expected an indented block')) {
        title = '必要なインデントがありません。'
      }
      solution = 'インデント(行頭の空白)を確認しましょう'
      break
    case 'KeyError':
      title = '辞書にないキーが使用されました。'
      solution = 'キーの名前を確認しましょう。'
      break
    case 'ModuleNotFoundError':
      const m = err.message.match(/No module named '(.+)'/)?.[1]
      title = m ? `「${m}」モジュールが見つかりませんでした。` : 'モジュールが見つかりませんでした。'
      solution = 'モジュールの名前を確認しましょう。使用できないモジュールもあります。'
      break
    case 'NameError':
      const v = err.message.match(/name \'(.+)\' is not defined/)?.[1]
      title = v ? '変数「' + v + '」は定義されていません。' : '定義されていない名前が使われています。'
      solution = 'スペルを確認しましょう。文字列の場合はクォーテーションで囲みましょう。'
      break
    case 'SyntaxError':
      const s = err.message.match(/Missing parentheses in call to '(.+)'/)
      if (s) {
        title = `${s[1]}を呼び出すには括弧が必要です。`
        break
      }
      const s1 = err.message.match(/duplicate argument '(.+)' in function definition/)
      if (s1) {
        title = `関数の引数「${s1}」が重複しています。`
        break
      }
      const s2 = err.message.includes('EOL while scanning string literal')
      if (s2) {
        title = `文字列が閉じられていません`
        solution = 'クォーテーションの閉じ忘れがないか確認しましょう。'
        break
      }
      title = '文法ミスがあります。'
      break
    case 'TypeError':
      const t = err.message.match(/can only concatenate str \(not "(.+)"\) to str/)?.[1]
      if (t) {
        title = `文字列と${t}型を連結することはできません`
        solution = '文字列と連結できるのは文字列のみです。数字を連結するときはstr()を用いて文字列に変換しましょう'
        break
      }
      const t2 = err.message.match(/can't multiply sequence by non-int of type '(.+)'/)?.[1]
      if (t2) {
        title = `${t2}型を掛けることはできません。`
        solution = '「*」の後に続けることができるのは整数型です。'
        break
      }
      const t3 = err.message.match(/^(.+) argument must be (.+), not '(.+)'/)
      if (t3) {
        title = `${t3[1]}に${t3[3]}型を渡すことはできません`
        solution = `${t3[1]}に渡すことができるのは、${t3[2]}です。`
        break
      }
      const t4 = err.message.match(/^(.+) missing ([0-9]+) required positional arguments'/)
      if (t4) {
        title = `${t4[1]}に必要な引数が${t4[2]}個不足しています。`
        solution = `${t4}に渡す引数の数を確認しましょう。`
      }
      title = '適切でない型が用いられました。'
      solution = '文字列や数値といった型を見直しましょう'
      break
    case 'ValueError':
      title = '適切ではない値が用いられました。'
      solution = '関数に渡す値を確認しましょう'
      break
  }
  return { title, solution, error: err }
}
function parseTraceback(input: string) {
  const stack: Stack[] = []
  const regLine = /File \"(.+)\", line ([0-9]+), in (.+)/g
  let result: RegExpExecArray | null
  let d = 100
  let lastLineNo: number = 0
  while ((result = regLine.exec(input)) !== null) {
    const [_, filename, lineno, name] = result
    lastLineNo = parseInt(lineno, 10)
    stack.unshift({ filename, lineno: lastLineNo, name })
    if (--d < 0) break
  }
  return { stack, lastLineNo }
}
