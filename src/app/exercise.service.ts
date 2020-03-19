import { Injectable } from '@angular/core'
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { SlideElementType } from './slide/slide-item'
import { Subject, BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { WebsocketService } from './websocket.service'
import { LessonDisplay } from './lesson/lesson.component'
import { LessonLogItem } from 'firestore-item'
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

  constructor(private db: AngularFirestore, private websocketService: WebsocketService, private app: AppService) {}

  init(courseId: string, lessonId: string) {
    this.db
      .collection<ExerciseData>(`course/${courseId}/lesson/${lessonId}/exercise`)
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
      .subscribe(docs => {
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

  logStart({ courseId, lessonId }: { courseId: string; lessonId: string }) {
    const timestamp = firebase.database.ServerValue.TIMESTAMP
    this.db
      .collection<LessonLogItem>('lesson_log')
      .add({
        course: courseId,
        lesson: lessonId,
        user: this.app.getUser().uid,
        start: timestamp,
        duration: null,
        end: null,
        face: null,
        done: false,
        created: timestamp,
        modified: timestamp,
      })
      .then(ref => {
        this.lessonLogRef = ref
      })
    this.lessonStart = new Date()
  }
  logEnd(abort: boolean = false) {
    if (this.lessonLogRef === null) {
      return
    }
    const timestamp = firebase.database.ServerValue.TIMESTAMP
    const duration = new Date().getTime() - this.lessonStart.getTime()
    this.lessonLogRef.update({
      end: timestamp,
      duration,
      done: !abort,
      modified: timestamp,
    })
    return duration
  }
  logFace(face: 0 | 1 | 2 | 3 | 4) {
    if (this.lessonLogRef === null) {
      return
    }
    this.lessonLogRef.update({
      face,
    })
  }
}
