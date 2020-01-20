import { Component, OnInit, ViewChild } from '@angular/core'
import { AceEditorComponent } from 'ng2-ace-editor'
import * as ace from 'ace-builds'
import { SlideData } from '../slide/slide-item'

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: AceEditorComponent
  text: string = ''
  options = { maxLines: 1000, printMargin: false }
  slides: SlideData[] = [
    {
      title: '〇〇してみよう',
      type: 'Cover',
      data: {
        author: '〇〇 太郎',
        organization: '〇〇教室',
        course: '〇〇 Step 1',
        lesson: '〇〇してみよう',
      },
    },
    {
      title: '〇〇について',
      type: 'OneColumn',
      data: {
        title: '〇〇について',
        body: [{ type: 'paragraph', content: 'one-column test' }],
      },
    },
    {
      title: '〇〇について',
      type: 'TwoColumn',
      data: {
        title: '〇〇について',
        left: [{ type: 'paragraph', content: 'two-column test\n左！！！' }],
        right: [{ type: 'paragraph', content: 'two-column test\n右！！！' }],
      },
    },
    {
      title: '〇〇について',
      type: 'Topic',
      data: {
        title: '〇〇',
        left: [{ type: 'paragraph', content: 'topic test\n左！！！' }],
        right: [{ type: 'paragraph', content: 'topic test\n右！！！' }],
      },
    },
  ]
  slideIndex: number = 0

  ngOnInit() {
    ace.config.set('basePath', 'path')
  }
  slidePrev() {
    if (this.slideIndex === 0) {
      return
    }
    this.slideIndex--
  }
  slideNext() {
    if (this.slideIndex >= this.slides.length - 1) {
      return
    }
    this.slideIndex++
  }

  executeCode() {}
}
