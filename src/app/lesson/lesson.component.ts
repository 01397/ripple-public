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
    this.slideService.fetchSlideData('1').subscribe(data => {
      this.slideService.setSlideData(data.body)
    })
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
