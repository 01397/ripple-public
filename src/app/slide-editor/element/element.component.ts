import { Component, OnInit, Input } from '@angular/core'
import { SlideElementType } from 'app/slide/slide-item'

@Component({
  selector: 'app-slide-editor-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss'],
})
export class SlideEditorElementComponent implements OnInit {
  public elementTypeList: [SlideElementType['type'], string][] = [
    ['paragraph', '段落'],
    ['image', '画像'],
    ['code', 'コード'],
    ['fillingCode', 'コード(穴埋め)'],
    ['quiz1', '4択'],
  ]
  @Input() public elements: SlideElementType[] = []
  /*[
    { type: 'paragraph', body: '生麦生米生卵' },
    {
      type: 'fillingCode',
      code: `age = 25
print("私は" + str(BLANK) + "歳です")
BLANK age < 20 :
    print("未成年なのでお酒は飲めません。")
BLANK :
    print("成人しているのでお酒を飲めます。")`,
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
  ]*/

  constructor() {}

  ngOnInit() {}

  addElement(type: SlideElementType['type']) {
    console.log(type)
  }

  // https://qiita.com/sassy_watson/items/9bd1cef78bfc110f0ba0
  myTrackBy(index: number, obj: any): any {
    return index
  }
}
