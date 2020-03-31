import { Component, OnInit, OnDestroy } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { CourseItem, LessonItemId, LessonRecordItem } from '../../firestore-item'
import { map, min, filter, take } from 'rxjs/operators'
import { Observable, Subscription } from 'rxjs'
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
  private record: {
    [x: string]: { count: number; last: Date; lessons: { [x: string]: { count: number; last: Date; face: number } } }
  } = {}

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
    this.app.authState
      .pipe(
        filter((value) => value === 'authorised'),
        take(1)
      )
      .subscribe(() => {
        const uid = this.app.getUserId()
        const lessonRecordPath = `user/${uid}/lesson_record`
        this.subscription.add(
          this.db
            .collection<LessonRecordItem>(lessonRecordPath)
            .valueChanges()
            .subscribe((docs) => {
              const record: {
                [key in string]: {
                  count: number
                  last: Date
                  lessons: { [key2 in string]: { count: number; last: Date; face: number | null } }
                }
              } = {}
              for (const doc of docs) {
                if (!record[doc.course]) {
                  record[doc.course] = { count: 0, lessons: {}, last: null }
                }
                const { count, last, face } = doc
                const lastDate = (last as firebase.firestore.Timestamp).toDate()
                const course = record[doc.course]
                course.lessons[doc.lesson] = { count: count as number, last: lastDate, face }
                course.count++
                if (course.last === null) {
                  course.last = lastDate
                } else if (course.last < lastDate) {
                  course.last = lastDate
                }
              }
              this.record = record
            })
        )
      })
  }

  ngOnDestroy() {
    for (const sub of this.subscription) {
      sub.unsubscribe()
    }
  }

  getCourseLastStudy(course: CourseItemId) {
    return this.record[course.id]?.last ?? null
  }
  getCourseProgress(course: CourseItemId) {
    return this.record[course.id]?.count ?? 0
  }
  getLessonLastStudy(lesson: LessonItemId) {
    return this.record[lesson.courseId]?.lessons[lesson.id]?.last ?? null
  }
  getLessonStudyCount(lesson: LessonItemId) {
    return this.record[lesson.courseId]?.lessons[lesson.id]?.count ?? 0
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
  getFaceSrc(lesson: LessonItemId) {
    const face = this.record[lesson.courseId]?.lessons[lesson.id]?.face ?? null
    if (face === null) {
      return `../../assets/images/face_blank.svg`
    } else {
      return `../../assets/images/face_${face}.svg`
    }
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
