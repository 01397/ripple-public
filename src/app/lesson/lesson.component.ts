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
  text: string = ''
  options = { maxLines: 1000, printMargin: false }
  sampleText =
    '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。'
  slideIndex: number = 0

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
            { type: 'image', src: '/assets/images/sample.png' },
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
            { type: 'paragraph', body: this.sampleText },
            { type: 'image', src: '/assets/images/sample.png' },
          ],
        },
      },
      {
        title: 'topic-slide test',
        slide: {
          type: 'topic',
          title: '用語概念スライド',
          left: [{ type: 'paragraph', body: this.sampleText }],
          right: [{ type: 'paragraph', body: this.sampleText }],
        },
      },
    ]
    this.slideService.setSlideData(slideData)
    ace.config.set('basePath', 'path')
  }
  slidePrev() {
    this.slideService.back()
  }
  slideNext() {
    this.slideService.forward()
  }
}
