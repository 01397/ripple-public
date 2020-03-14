import { Component, OnInit } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { CourseItem, LessonItem, LessonItemId } from 'firestore-item'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

interface CourseItemId extends CourseItem {
  id: string
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  private courseObservable: Observable<CourseItemId[]>
  public courses: CourseItemId[]
  public lessons: Observable<LessonItemId[]>
  public selectedCourse: CourseItemId

  constructor(public db: AngularFirestore) {}

  ngOnInit() {
    this.courseObservable = this.db
      .collection<CourseItem>('course')
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
    this.courseObservable.subscribe(courses => {
      this.courses = courses
    })
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
      .collection<LessonItemId>(`course/${courseId}/lesson`)
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
