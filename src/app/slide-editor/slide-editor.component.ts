import { Component, OnInit } from '@angular/core'
import { SlideType, SlideData } from 'app/slide/slide-item'
import { SlideService } from 'app/slide/slide.service'
import { ActivatedRoute, Router } from '@angular/router'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

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

  constructor(public slideService: SlideService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('course')
    const lessonId = this.route.snapshot.paramMap.get('lesson')
    this.path = `course/${courseId}/lesson/${lessonId}`
    this.slideService.setSlideData(this.path)
    this.slideService.slideSubject.subscribe((slide) => {
      this.current = slide
      this.currentIndex = this.slideService.index
    })
  }

  changeSlide(index: number) {
    this.slideService.go(index, true)
  }

  updateSlide() {
    this.changeSlide(this.slideService.index)
  }

  public speech() {
    this.slideService.speech()
  }

  save() {
    return this.slideService.save()
  }
  finish() {
    this.save().then(() => {
      this.router.navigate(['/admin/material'])
    })
  }

  slideDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.slideService.getSlide(), event.previousIndex, event.currentIndex)
    this.updateSlide()
  }

  addSlide(typeIndex: SlideType['type']) {
    this.slideService.addSlide(typeIndex)
    this.updateSlide()
  }

  removeSlide(index: number) {
    this.slideService.removeSlide(index)
    this.updateSlide()
  }
}
