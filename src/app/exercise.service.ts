import { Injectable } from '@angular/core'
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { SlideElementType } from './slide/slide-item'
import { Subject, BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { WebsocketService } from './websocket.service'
import { LessonDisplay } from './lesson/lesson.component'
import { LessonLogItem, LessonRecordItem } from './../firestore-item'
import * as firebase from 'firebase'
import { AppService } from './app.service'
export interface ExerciseData {
  index: number
  title: string
  description: SlideElementType[]
  defaultCode: string
}
export interface ExerciseDataId extends ExerciseData {
  id: string
}

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  /**
   * 演習問題のデータ
   */
  public exList: BehaviorSubject<ExerciseDataId[]> = new BehaviorSubject([
    {
      id: null,
      index: 0,
      title: '読み込み中',
      description: [],
      defaultCode: '',
    },
  ])
  /**
   * 表示中の演習問題番号
   */
  public exIndex: BehaviorSubject<number> = new BehaviorSubject(0)
  /**
   * 表示可能な演習問題番号の最大値
   */
  public unlockedIndex: number = 0
  /**
   * 判定処理中か？
   */
  public judging: boolean = false
  /**
   * 演習問題のID (db上のid)
   */
  public get exId() {
    return this.exList.value[this.exIndex.value].id
  }
  /**
   * 画面モードの変更要求を伝える
   */
  public modeRequest: Subject<LessonDisplay> = new Subject()
  /**
   * レッスン実行記録, 終了時に記録用に保管hokann
   */
  private lessonLogRef: DocumentReference = null
  /**
   * レッスン開始時刻
   */
  private lessonStart: Date = null
  /**
   * 現在のレッスンID
   */
  private lessonId: string
  /**
   * 現在のレッスンID
   */
  private courseId: string

  constructor(private db: AngularFirestore, private websocketService: WebsocketService, private app: AppService) {}

  init(courseId: string, lessonId: string) {
    this.lessonId = lessonId
    this.courseId = courseId
    this.db
      .collection<ExerciseData>(`course/${courseId}/lesson/${lessonId}/exercise`)
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
      .subscribe((docs) => {
        this.exList.next(docs.sort((a, b) => a.index - b.index))
        this.exIndex.next(0)
      })
  }

  goNext() {
    const nextIndex = this.exIndex.value + 1
    if (nextIndex >= this.exList.value.length) {
      this.modeRequest.next('wrapup')
      return
    } else if (this.unlockedIndex + 1 === nextIndex) {
      this.unlockedIndex++
    }
    this.exIndex.next(nextIndex)
  }

  changeExIndex(i: number) {
    if (i > this.unlockedIndex) {
      return
    }
    this.exIndex.next(i)
  }

  judge(data: { language_id: number; source_code: string; exercise: string }) {
    this.websocketService.emit('judge', JSON.stringify(data))
    this.judging = true
  }

  logStart() {
    if (this.app.authState.value !== 'authorised') {
      throw new Error('ログインしていないため、学習ログを記録できません')
    }
    const timestamp = firebase.firestore.FieldValue.serverTimestamp()
    this.db
      .collection<LessonLogItem>('lesson_log')
      .add({
        course: this.courseId,
        lesson: this.lessonId,
        user: this.app.getUserId(),
        start: timestamp,
        duration: null,
        end: null,
        face: null,
        done: false,
        created: timestamp,
        modified: timestamp,
      })
      .then((ref) => {
        this.lessonLogRef = ref
      })

    this.lessonStart = new Date()
  }
  logEnd(abort: boolean = false) {
    if (this.app.authState.value !== 'authorised') {
      throw new Error('ログインしていないため、学習ログを記録できません')
    }
    if (this.lessonLogRef === null) {
      throw new Error('学習開始記録がないため、学習ログを記録できません')
    }
    const timestamp = firebase.firestore.FieldValue.serverTimestamp()
    const duration = new Date().getTime() - this.lessonStart.getTime()
    const userID = this.app.getUserId()
    const batch = this.db.firestore.batch()
    const lessonLog: Partial<LessonLogItem> = {
      end: timestamp,
      duration,
      done: !abort,
      modified: timestamp,
    }
    batch.set(this.lessonLogRef, lessonLog, {
      merge: true,
    })
    const lessonRecordPath = `user/${userID}/lesson_record/${this.lessonId}`
    const lessonRecordRef = this.db.doc<LessonRecordItem>(lessonRecordPath).ref
    const lessonRecord: LessonRecordItem = {
      user: userID,
      course: this.courseId,
      lesson: this.lessonId,
      face: null,
      last: firebase.firestore.FieldValue.serverTimestamp(),
      count: firebase.firestore.FieldValue.increment(1),
      modified: firebase.firestore.FieldValue.serverTimestamp(),
    }
    batch.set(lessonRecordRef, lessonRecord, {
      merge: true,
    })
    batch.commit()
    return duration
  }
  /**
   * レッスン終了後に、感想を選択したときに呼ばれる
   * @param face 顔番号
   */
  async logFace(face: 0 | 1 | 2 | 3 | 4) {
    if (this.app.authState.value !== 'authorised') {
      throw new Error('ログインしていないため、学習ログを記録できません')
    }
    if (this.lessonLogRef === null) {
      throw new Error('学習開始記録がないため、学習ログを記録できません')
    }
    const batch = this.db.firestore.batch()
    // ユーザの記録
    const uid = this.app.getUserId()
    const lessonRecordPath = `user/${uid}/lesson_record/${this.lessonId}`
    const lessonRecordRef = this.db.doc<LessonRecordItem>(lessonRecordPath).ref
    const lessonRecord: Partial<LessonRecordItem> = {
      face,
      modified: firebase.firestore.FieldValue.serverTimestamp(),
    }
    batch.set(lessonRecordRef, lessonRecord, { merge: true })
    // logの記録
    batch.set(
      this.lessonLogRef,
      {
        face,
        modified: firebase.database.ServerValue.TIMESTAMP,
      },
      { merge: true }
    )
    batch.commit().then(() => console.log('sent'))
  }
}
