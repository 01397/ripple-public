import { Injectable, Input } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { SlideElementType } from './slide/slide-item'
import { Observable, Subject, BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
export interface ExerciseData {
  index: number
  title: string
  description: SlideElementType[]
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
    },
  ])
  public exIndex: BehaviorSubject<number> = new BehaviorSubject(0)
  public unlockedIndex: number = 1
  public get exId() {
    return this.exList.value[this.exIndex.value].id
  }

  constructor(private firestore: AngularFirestore) {}

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

  changeExIndex(i: number) {
    if (i > this.unlockedIndex) {
      return
    }
    this.exIndex.next(i)
  }
}
