import { Component, OnInit, ViewChild } from '@angular/core'
import { AceEditorComponent } from 'ng2-ace-editor'
import * as ace from 'ace-builds'
import { SlideItem } from '../slide/slide/slide-item'
import { SlideCodingComponent } from '../slide/slide-coding/slide-coding.component'
import { SlideCoverComponent } from '../slide/slide-cover/slide-cover.component'

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: AceEditorComponent
  text: string = ''
  options = { maxLines: 1000, printMargin: false }
  data = [{ author: '〇〇 太郎', organization: '〇〇教室', course: '〇〇 Step 1', lesson: '〇〇してみよう' }]
  public slide = new SlideItem(SlideCoverComponent, this.data[0])

  ngOnInit() {
    ace.config.set('basePath', 'path')
  }

  executeCode() {}
}
