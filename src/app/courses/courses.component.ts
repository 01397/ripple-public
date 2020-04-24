import { Component, OnDestroy, OnInit } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { CourseItem, LessonItemId } from '../../firestore-item'
import { AppService } from '../app.service'

interface CourseItemId extends CourseItem {
  id: string
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  private courseObservable: Observable<CourseItemId[]>
  public courses: CourseItemId[]
  public lessons: Observable<LessonItemId[]>
  public selectedCourse: CourseItemId
  private subscription = new Set<Subscription>()

  constructor(public db: AngularFirestore, private app: AppService) {}

  ngOnInit() {
    this.courseObservable = this.db
      .collection<CourseItem>('course', (ref) => ref.where('private', '==', false))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data()
            const id = a.payload.doc.id
            return { id, ...data }
          })
        )
      )
    this.subscription.add(
      this.courseObservable.subscribe((courses) => {
        this.courses = courses
      })
    )
  }

  ngOnDestroy() {
    for (const sub of this.subscription) {
      sub.unsubscribe()
    }
  }

  getCourseLastStudy(course: CourseItemId) {
    return this.app.getCourseLastStudy(course.id)
  }
  getCourseProgress(course: CourseItemId) {
    return this.app.getCourseProgress(course.id)
  }
  getProgressArray(course: CourseItemId, radius: number) {
    const length = 2 * Math.PI * radius
    const ratio = this.getProgressRatio(course)
    return `${length * ratio} ${length * (1 - ratio)}`
  }
  getProgressRatio(course: CourseItemId) {
    const max = course.total ?? 0
    const value = this.getCourseProgress(course)
    return Math.min(1, Math.max(0, value / max))
  }
  getProgressPercent(course: CourseItemId) {
    return Math.round(this.getProgressRatio(course) * 100)
  }

  selectCourse(course: CourseItemId) {
    this.selectedCourse = course
    const courseId = course.id
    this.lessons = this.db
      .collection<LessonItemId>(`course/${courseId}/lesson`, (ref) => ref.where('private', '==', false))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data()
            const id = a.payload.doc.id
            return { id, courseId, ...data }
          })
        )
      )
  }
}
