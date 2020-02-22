import { Injectable } from '@angular/core'

import { InMemoryDbService } from 'angular-in-memory-web-api'
import { SlideType, SlideData } from './slide/slide-item'

@Injectable()
export class InMemoryApiService implements InMemoryDbService {
  private api: { lessons: { id: number; body: SlideData[], title: string }[] } = {
    // ユーザ情報とか
    lessons: [
      {
        id: 1,
        body: [
          {
            title: 'title-slide test',
            slide: {
              type: 'cover',
              author: '〇〇 太郎',
              organization: '〇〇教室',
              course: '〇〇 Step 1',
              lesson: 'タイトルスライド',
            },
            speech: {
              text: '',
            },
          },
          {
            title: '1col-slide test',
            slide: {
              type: 'oneColumn',
              title: '1カラムのスライド',
              body: [
                {
                  type: 'paragraph',
                  body:
                    '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。',
                },
                {
                  type: 'fillingCode',
                  lang: 'python',
                  code:
                    'age = 25\nprint("私は" + str(BLANK) + "歳です")\nBLANK age < 20 :\n    print("未成年なのでお酒は飲めません。")\nBLANK :\n    print("成人しているのでお酒を飲めます。")',
                  blanks: [
                    {
                      size: 3,
                      type: 'equalTo',
                      values: ['age'],
                    },
                    {
                      size: 3,
                      type: 'equalTo',
                      values: ['if'],
                    },
                    {
                      size: 3,
                      type: 'equalTo',
                      values: ['else'],
                    },
                  ],
                },
              ],
            },
            speech: {
              text: 'これは、1カラムのスライドです。ここでは、本文とコードの空欄補充問題の2つを含めています。',
            },
          },
          {
            title: '2col-slide test',
            slide: {
              type: 'twoColumn',
              title: '2カラムのスライド',
              left: [
                {
                  type: 'paragraph',
                  body:
                    '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。',
                },
                {
                  type: 'code',
                  lang: 'python',
                  code: 'sum = 0\nfor i in range(100):\n   sum = sum + i\nprint(sum)',
                },
              ],
              right: [
                {
                  type: 'quiz1',
                  title: '電通大について正しいものを選べ',
                  answer: 3,
                  options: [
                    '正式名称は電気不足通信障害大学である',
                    '株式会社電通が運営する大学である',
                    'オンラインで受講できる通信大学である',
                    '輪郭の断片がある',
                  ],
                  shuffle: true,
                },
              ],
            },
            speech: {
              text: 'こちらは2カラムのテストです。電通大について正しいものを1つ選びましょう。',
            },
          },
          {
            title: 'topic-slide test',
            slide: {
              type: 'topic',
              title: '用語概念スライド',
              left: [
                {
                  type: 'paragraph',
                  body:
                    '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。',
                },
              ],
              right: [{ type: 'image', src: '/assets/images/sample.png' }],
            },
            speech: {
              text:
                'これは概念スライドです。例えば、本気と書いて[本気|まじ]と読むとか、正解は、<1.5s>3番でした！のように[間|ま]を持たせることもできます。',
            },
          },
        ],
        title: 'レッスンDEMO',
      },
    ],
  }

  /**
   * InMemoryDbService から継承 : モックデータを作成する
   *
   * @return モックデータ
   */
  public createDb(): any {
    return this.api
  }
}
