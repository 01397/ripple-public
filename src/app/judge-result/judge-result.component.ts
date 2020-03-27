import { Component, OnInit } from '@angular/core'
import { ExerciseService } from '../exercise.service'
import { WebsocketService } from '../websocket.service'

@Component({
  selector: 'app-judge-result',
  templateUrl: './judge-result.component.html',
  styleUrls: ['./judge-result.component.scss'],
})
export class JudgeResultComponent implements OnInit {
  result: number[]
  resultString = {
    null: '待機中...', // apiリクエスト前
    1: '待機中...',
    2: '処理中...',
    3: '正解',
    4: '出力結果が正しくありません',
    5: '制限時間内に処理が終わりませんでした',
    6: 'コンパイルエラー',
    7: '実行時エラー',
    8: '実行時エラー',
    9: '実行時エラー',
    10: '実行時エラー',
    11: '実行時エラー',
    12: '実行時エラー',
    13: '採点システムでエラーが起きています', // judge0のエラー
    14: '採点システムで処理できませんでした',
  }
  public done = false
  public error = false
  public get allAccepted() {
    return this.result.every((v) => v === 3)
  }
  constructor(private exService: ExerciseService, private websocketService: WebsocketService) {}

  ngOnInit() {
    this.websocketService.judgeSubject.subscribe((data) => {
      this.result = data.result
      this.done = data.done
      this.error = data.error
    })
  }
  close() {
    this.exService.judging = false
  }
  next() {
    this.exService.goNext()
    this.close()
  }
}
