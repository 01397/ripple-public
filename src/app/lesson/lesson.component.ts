import { Component, OnInit, ViewChild } from '@angular/core'
import { AceEditorComponent } from 'ng2-ace-editor'
import * as ace from 'ace-builds'
import { SlideService } from '../slide/slide.service'
import { ActivatedRoute } from '@angular/router'
import { ExerciseService } from '../exercise.service'

export type LessonDisplay = 'slide' | 'exercise' | 'wrapup'

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
  public displayMode: LessonDisplay = 'slide'
  public get judging() {
    return this.displayMode === 'exercise' && this.exService.judging
  }

  constructor(private slideService: SlideService, private exService: ExerciseService, private route: ActivatedRoute) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('course')
    const lessonId = this.route.snapshot.paramMap.get('lesson')
    const path = `course/${courseId}/lesson/${lessonId}`
    this.slideService.setSlideData(path)
    this.exService.init(courseId, lessonId)

    ace.config.set('basePath', 'path')
    this.slideService.nav.subscribe(nav => {
      // ExpressionChangedAfterItHasBeenCheckedError を回避するために非同期関数を利用
      setTimeout(() => {
        this.navBack = nav.back
        this.navForward = nav.forward
      })
    })
    this.exService.modeRequest.subscribe(mode => {
      this.displayMode = mode
    })
    this.slideService.modeRequest.subscribe(mode => {
      this.displayMode = mode
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
  toggle() {
    if (this.displayMode === 'slide') {
      this.displayMode = 'exercise'
    } else if (this.displayMode === 'exercise') {
      this.displayMode = 'slide'
    }
  }
}
