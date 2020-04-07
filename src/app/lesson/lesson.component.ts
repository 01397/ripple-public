import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { AceEditorComponent } from 'ng2-ace-editor'
import * as ace from 'ace-builds'
import { SlideService } from '../slide/slide.service'
import { ActivatedRoute } from '@angular/router'
import { ExerciseService } from '../exercise.service'
import { AppService } from '../app.service'
import { Subscription } from 'rxjs'
import { take, filter } from 'rxjs/operators'

export type LessonDisplay = 'slide' | 'exercise' | 'wrapup' | 'review'

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit, OnDestroy {
  @ViewChild('editor', { static: false }) editor: AceEditorComponent
  public text: string = ''
  public options = { maxLines: 1000, printMargin: false }

  public navBack = false
  public navForward = true
  public displayMode: LessonDisplay = 'slide'
  public result: { title: string; duration: number } = {
    title: '',
    duration: null,
  }
  public get judging() {
    return this.displayMode === 'exercise' && this.exService.judging
  }
  private subscription = new Set<Subscription>()
  public isPlaying = false
  // 感想の顔番号
  public face: number = null
  constructor(
    private slideService: SlideService,
    private exService: ExerciseService,
    private app: AppService,
    private route: ActivatedRoute
  ) {}
  /**
   * スライドを閉じて演習へ進めるか
   */
  public slideClosable: boolean = false

  ngOnInit() {
    this.subscription.add(
      this.slideService.slideTitle.subscribe((title) => {
        this.result.title = title
        this.app.setHeaderTitle(title)
      })
    )
    this.app.authState
      .pipe(
        filter((value) => value === 'authorised'),
        take(1)
      )
      .subscribe(() => {
        this.onAuth()
      })
  }
  onAuth() {
    const courseId = this.route.snapshot.paramMap.get('course')
    const lessonId = this.route.snapshot.paramMap.get('lesson')
    const path = `course/${courseId}/lesson/${lessonId}`
    this.slideService.setSlideData(path)
    this.exService.init(courseId, lessonId)
    this.exService.logStart()

    ace.config.set('basePath', 'path')
    this.subscription.add(
      this.slideService.nav.subscribe((nav) => {
        // ExpressionChangedAfterItHasBeenCheckedError を回避するために非同期関数を利用
        setTimeout(() => {
          this.navBack = nav.back
          this.navForward = nav.forward
        })
      })
    )
    const modeChange = (mode: LessonDisplay) => {
      this.displayMode = mode
      if (mode === 'review') {
        this.slideClosable = true
      } else if (mode === 'wrapup') {
        this.onWrapup()
      }
    }
    this.subscription.add(this.exService.modeRequest.subscribe(modeChange))
    this.subscription.add(this.slideService.modeRequest.subscribe(modeChange))
    this.subscription.add(
      this.slideService.playState.subscribe((flag) => {
        this.isPlaying = flag
      })
    )
  }
  get isMuted() {
    return this.slideService.muted
  }
  toggleMute() {
    this.slideService.toggleMute()
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
  onWrapup() {
    this.result.duration = this.exService.logEnd()
  }
  resumeExercise() {
    this.exService.modeRequest.next('exercise')
  }
  /**
   * 感想を記録する
   * @param i 感想番号
   */
  selectFace(i: 0 | 1 | 2 | 3 | 4) {
    this.face = i
    this.exService.logFace(i)
  }

  ngOnDestroy() {
    for (const sub of this.subscription) {
      sub.unsubscribe()
    }
  }
}
