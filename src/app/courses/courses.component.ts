import { Component, OnInit, OnDestroy } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { CourseItem, LessonItem, LessonItemId, LessonRecordItem } from 'firestore-item'
import { map } from 'rxjs/operators'
import { Observable, Subscription } from 'rxjs'
import { AppService } from 'app/app.service'

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
      .collection<CourseItem>('course', ref => ref.where('private', '==', false))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data()
            const id = a.payload.doc.id
            return { id, ...data }
          })
        )
      )
    this.subscription.add(
      this.courseObservable.subscribe(courses => {
        this.courses = courses
      })
    )
    const lessonRecordPath = `user/${this.app.getUser().uid}/lesson_record`
    this.subscription.add(
      this.db
        .collection<LessonRecordItem>(lessonRecordPath)
        .valueChanges()
        .subscribe(docs => {
          const record: {
            [key in string]: { count: number; last: Date; lessons: { [key2 in string]: { count: number; last: Date } } }
          } = {}
          for (const doc of docs) {
            if (!record[doc.course]) {
              record[doc.course] = { count: 0, lessons: {}, last: null }
            }
            const { count, last } = doc
            const lastDate = (last as firebase.firestore.Timestamp).toDate()
            record[doc.course].lessons[doc.lesson] = { count: count as number, last: lastDate }
            record[doc.course].count++
          }
        })
    )
  }

  ngOnDestroy() {
    for (const sub of this.subscription) {
      sub.unsubscribe()
    }
  }

  getCourseLastStudy(id: string) {
    return ''
  }
  getCourseProgress(id: string) {
    return ''
  }
  getLessonLastStudy(id: string) {
    return ''
  }
  getLessonStudyCount(id: string) {
    return ''
  }
  selectCourse(course: CourseItemId) {
    this.selectedCourse = course
    const courseId = course.id
    this.lessons = this.db
      .collection<LessonItemId>(`course/${courseId}/lesson`, ref => ref.where('private', '==', false))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data()
            const id = a.payload.doc.id
            return { id, courseId, ...data }
          })
        )
      )
  }
}
