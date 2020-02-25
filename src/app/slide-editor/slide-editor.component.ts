import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { SlideType, SlideData } from 'app/slide/slide-item'
import { SlideService } from 'app/slide/slide.service'
import { Route } from '@angular/compiler/src/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { switchMap } from 'rxjs/operators'
import { firestore } from 'firebase'

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
  private path: string

  constructor(public slideService: SlideService, private route: ActivatedRoute) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('course')
    const lessonId = this.route.snapshot.paramMap.get('lesson')
    this.path = `course/${courseId}/lesson/${lessonId}`
    this.slideService.setSlideData(this.path)
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

  save() {
    this.slideService.save()
  }
}
