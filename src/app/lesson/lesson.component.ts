import { Component, OnInit, ViewChild } from '@angular/core'
import { AceEditorComponent } from 'ng2-ace-editor'
import * as ace from 'ace-builds'
import { SlideData } from '../slide/slide-item'
import { SlideService } from 'app/slide/slide.service'

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: AceEditorComponent
  public text: string = ''
  public options = { maxLines: 1000, printMargin: false }

  private sampleText =
    '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。'
  public navBack = false
  public navForward = true

  constructor(private slideService: SlideService) {}

  ngOnInit() {
    const slideData: SlideData[] = [
      {
        title: 'title-slide test',
        slide: {
          type: 'cover',
          author: '〇〇 太郎',
          organization: '〇〇教室',
          course: '〇〇 Step 1',
          lesson: 'タイトルスライド',
        },
      },
      {
        title: '1col-slide test',
        slide: {
          type: 'oneColumn',
          title: '1カラムのスライド',
          body: [
            { type: 'paragraph', body: this.sampleText },
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
          ],
        },
      },
      {
        title: '2col-slide test',
        slide: {
          type: 'twoColumn',
          title: '2カラムのスライド',
          left: [
            { type: 'paragraph', body: this.sampleText },
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
      },
      {
        title: 'topic-slide test',
        slide: {
          type: 'topic',
          title: '用語概念スライド',
          left: [{ type: 'paragraph', body: this.sampleText }],
          right: [{ type: 'image', src: '/assets/images/sample.png' }],
        },
      },
    ]
    this.slideService.setSlideData(slideData)
    ace.config.set('basePath', 'path')
    this.slideService.nav.subscribe(nav => {
      // ExpressionChangedAfterItHasBeenCheckedError を回避するために非同期関数を利用
      setTimeout(() => {
        this.navBack = nav.back
        this.navForward = nav.forward
      })
    })
  }
  slidePrev() {
    this.slideService.back()
  }
  slideNext() {
    this.slideService.forward()
  }
}
