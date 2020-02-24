import { Component, OnInit } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { MatSnackBar } from '@angular/material'
import { firestore } from 'firebase'

interface CourseItem {
  title: string
  description: string
  private: boolean
  lesson: AngularFirestoreCollection
  created: firestore.Timestamp
  modified: firestore.Timestamp
}
interface CourseItemId extends CourseItem {
  id: string
}
interface LessonItem {
  title: string
  description: string
  private: boolean
  lesson: AngularFirestoreCollection
  exercise: AngularFirestoreCollection
  created: firestore.Timestamp
  modified: firestore.Timestamp
}
interface LessonItemId extends LessonItem {
  id: string
  courseId: string
}

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
})
export class MaterialComponent implements OnInit {
  public courses: Observable<CourseItemId[]>
  public lessons: Observable<LessonItemId[]>
  public selectedCourse: CourseItemId | null = null
  public selectedLesson: LessonItemId | null = null
  public type: 'course' | 'lesson' = 'course'

  constructor(public firestore: AngularFirestore, private snackbar: MatSnackBar) {}

  ngOnInit() {
    this.courses = this.firestore
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
  }

  selectCourse(course: CourseItemId) {
    this.selectedCourse = course
  }
  openCourse(courseId: string) {
    this.lessons = this.firestore
      .collection<LessonItem>(`course/${courseId}/lesson`)
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
    this.type = 'lesson'
  }

  updateCourse(course: CourseItemId) {
    const content = { ...course }
    delete content.id
    content.modified = firestore.Timestamp.fromDate(new Date())
    this.firestore
      .doc(`course/${course.id}`)
      .update(content)
      .then(() => {
        this.snackbar.open('更新しました')
      })
  }

  updateLesson(lesson: LessonItemId) {
    const content = { ...lesson }
    delete content.courseId
    delete content.id
    content.modified = firestore.Timestamp.fromDate(new Date())
    this.firestore.doc(`course/${lesson.courseId}/lesson/${lesson.id}`).update(content)
  }

  selectLesson(lesson: LessonItemId) {
    this.selectedLesson = lesson
  }

  openLesson(lessonId: string) {
    console.log(lessonId)
  }

  backToCourse() {
    this.type = 'course'
    this.selectedLesson = null
  }
}
