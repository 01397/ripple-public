import { Component, OnInit } from '@angular/core'
import { SlideElementType } from 'app/slide/slide-item'

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {
  public exData: { index: number; title: string; description: SlideElementType[]; testcase: string[] }[] = [
    {
      index: 0,
      title: '練習だよ',
      description: [
        {
          type: 'paragraph',
          body: 'print文を使って、画面に自己紹介文を出力しましょう',
        },
        {
          type: 'paragraph',
          body: 'まずは自分の名前を出力しましょう',
        },
        {
          type: 'code',
          lang: 'python',
          code: 'print("Hello,my name is Ripple")',
          fontSize: 14,
        },
      ],
      testcase: [],
    },
    {
      index: 0,
      title: '練習だよ',
      description: [
        {
          type: 'paragraph',
          body: 'print文を使った！',
        },
        {
          type: 'paragraph',
          body: '自分の学年を出力しましょう',
        },
        {
          type: 'code',
          lang: 'python',
          code: 'print("Hello, my name is 3")',
          fontSize: 14,
        },
      ],
      testcase: [],
    },
    { index: 0, title: '練習だよ', description: [], testcase: [] },
  ]
  public exIndex: number = 0
  public unlockedIndex: number = 1
  constructor() {}

  ngOnInit() {}

  changeExIndex(i: number) {
    if (i > this.unlockedIndex) {
      return
    }
    this.exIndex = i
  }
}
