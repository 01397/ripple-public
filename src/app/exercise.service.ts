import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { SlideElementType } from './slide/slide-item'
import { Subject, BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { WebsocketService } from './websocket.service'
import { LessonDisplay } from './lesson/lesson.component'
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
  public exList: BehaviorSubject<ExerciseDataId[]> = new BehaviorSubject([
    {
      id: null,
      index: 0,
      title: '読み込み中',
      description: [],
      defaultCode: '',
    },
  ])
  public exIndex: BehaviorSubject<number> = new BehaviorSubject(0)
  public unlockedIndex: number = 0
  public judging: boolean = false
  public get exId() {
    return this.exList.value[this.exIndex.value].id
  }
  public modeRequest: Subject<LessonDisplay> = new Subject()

  constructor(private firestore: AngularFirestore, private websocketService: WebsocketService) {}

  init(courseId: string, lessonId: string) {
    this.firestore
      .collection('course')
      .doc(courseId)
      .collection('lesson')
      .doc(lessonId)
      .collection<ExerciseData>('exercise')
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
}
