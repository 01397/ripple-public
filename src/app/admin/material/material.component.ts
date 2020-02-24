import { Component, OnInit, Inject } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { firestore } from 'firebase'
import { Router } from '@angular/router'
import { CourseItemId, LessonItemId, CourseItem, LessonItem } from 'firestore-item'

export interface DialogData {
  name: string
}

@Component({
  selector: 'material-dialog',
  templateUrl: './material-dialog.html',
})
export class MaterialDialog {
  constructor(public dialogRef: MatDialogRef<MaterialDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
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
  /**
   * コース一覧か、レッスン一覧か。
   */
  public type: 'course' | 'lesson' = 'course'

  constructor(
    public firestore: AngularFirestore,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) {}

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

  /**
   * コース選択時に情報を表示する処理。
   * @param course 選択するコース
   */
  selectCourse(course: CourseItemId) {
    this.selectedCourse = course
  }

  /**
   * レッスン選択時に情報を表示する処理
   * @param lesson 選択されたレッスン
   */
  selectLesson(lesson: LessonItemId) {
    this.selectedLesson = lesson
  }

  /**
   * コース内のレッスン一覧を表示する処理
   * @param courseId 表示するid情報を含めたコース
   */
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

  /**
   * レッスンを開く...?
   * @param lessonId id情報を含めた、表示するレッスン
   */
  openLesson(lessonId: string) {
    console.log(lessonId)
  }

  /**
   * コースのdb更新処理
   * @param course 更新を行うコース
   */
  updateCourse(course: CourseItemId) {
    const content = { ...course }
    delete content.id
    content.modified = firestore.Timestamp.fromDate(new Date())
    this.firestore
      .doc(`course/${course.id}`)
      .update(content)
      .then(() => {
        this.snackbar.open('更新しました', null, { duration: 2000, horizontalPosition: 'right' })
      })
      .catch(reason => {
        console.error(reason)
        this.snackbar.open('更新処理に失敗しました。', null, { duration: 5000, horizontalPosition: 'right' })
      })
  }

  /**
   * レッスンのdb更新処理
   * @param lesson 更新対象のレッスン
   */
  updateLesson(lesson: LessonItemId) {
    const content = { ...lesson }
    delete content.courseId
    delete content.id
    content.modified = firestore.Timestamp.fromDate(new Date())
    this.firestore
      .doc(`course/${lesson.courseId}/lesson/${lesson.id}`)
      .update(content)
      .then(() => {
        this.snackbar.open('更新しました', null, { duration: 2000, horizontalPosition: 'right' })
      })
      .catch(reason => {
        console.error(reason)
        this.snackbar.open('更新処理に失敗しました。', null, { duration: 5000, horizontalPosition: 'right' })
      })
  }

  /**
   * レッスン一覧から、コース一覧に戻る
   */
  backToCourse() {
    this.type = 'course'
    this.selectedLesson = null
  }

  /**
   * コースを除去
   */
  removeCourse(courseId: string) {
    // 先にサブコレクションを全て除去する必要がある
    this.snackbar.open('コースの削除は現在サポートされていません。代わりに非公開にしてください。')
  }

  /**
   * レッスンを除去
   */
  removeLesson(courseId: string, lessonId: string) {
    this.dialog
      .open(MaterialDialog, {
        data: { name: this.selectedLesson.title },
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.firestore
            .doc(`course/${courseId}/lesson/${lessonId}`)
            .delete()
            .then(() => {
              this.snackbar.open('削除しました')
              this.selectLesson = null
            })
        }
      })
  }

  /**
   * コース作成
   */
  addCourse() {
    const now = firestore.Timestamp.fromDate(new Date())
    const newCourse: CourseItem = {
      title: '',
      description: '',
      private: true,
      modified: now,
      created: now,
    }
    this.firestore.collection('course').add(newCourse)
  }
  /**
   * コース作成
   */
  addLesson() {
    if (!this.selectedCourse) {
      this.snackbar.open('コースが選択されていません', null, { duration: 4000 })
      return
    }
    const now = firestore.Timestamp.fromDate(new Date())
    const newLesson: LessonItem = {
      title: '',
      description: '',
      private: true,
      slide: { data: [] },
      modified: now,
      created: now,
    }
    this.firestore.collection(`course/${this.selectedCourse.id}/lesson`).add(newLesson)
  }

  /**
   * スライド作成へ
   */
  editSlide() {
    this.router.navigate([
      '/admin/slide-editor',
      { course: this.selectedLesson.courseId, lesson: this.selectedLesson.id },
    ])
  }
}
