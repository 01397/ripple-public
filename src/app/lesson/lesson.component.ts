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

  public navBack = false
  public navForward = true

  constructor(private slideService: SlideService) {}

  ngOnInit() {
    this.slideService.setSlideData('dev')
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
  toggleSubtitles() {
    this.slideService.toggleSubtitles()
  }
}
