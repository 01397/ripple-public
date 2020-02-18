import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { SlideType, SlideData } from 'app/slide/slide-item'
import { SlideService } from 'app/slide/slide.service'

@Component({
  selector: 'app-slide-editor',
  templateUrl: './slide-editor.component.html',
  styleUrls: ['./slide-editor.component.scss'],
})
export class SlideEditorComponent implements OnInit {
  public slideTypes: { type: SlideType['type']; label: string }[] = [
    { type: 'cover', label: '表紙' },
    { type: 'oneColumn', label: '1カラム' },
    { type: 'twoColumn', label: '2カラム' },
    { type: 'topic', label: '用語,概念' },
  ]
  public current: SlideData
  public currentIndex: number

  constructor(public slideService: SlideService) {}

  ngOnInit() {
    this.slideService.fetchSlideData('1').subscribe(data => {
      this.slideService.setSlideData(data.body)
    })
    this.slideService.slideSubject.subscribe(slide => {
      this.current = slide
      this.currentIndex = this.slideService.index
    })
  }

  changeSlide(index: number) {
    this.slideService.go(index, true)
  }

  public speech() {
    this.slideService.speech()
  }
}
