import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { Component, OnInit } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { Testcase } from '../../../routes/judge'
import { ExerciseData, ExerciseDataId } from '../exercise.service'

interface TestcaseId extends Testcase {
  id: string
}

@Component({
  selector: 'app-exercise-editor',
  templateUrl: './exercise-editor.component.html',
  styleUrls: ['./exercise-editor.component.scss'],
})
export class ExerciseEditorComponent implements OnInit {
  public exList: ExerciseDataId[] = []
  private exRef: AngularFirestoreCollection<ExerciseData>
  private exObservable: Observable<ExerciseDataId[]>
  public exIndex: number = 0
  private removedId: string[] = []
  public caseList: TestcaseId[] = []
  private caseRef: AngularFirestoreCollection<Testcase>
  private caseObservale: Observable<TestcaseId[]>
  private removedCaseId: string[] = []
  private lessonId: string = ''
  public editorOptions = {
    maxLines: 1000,
    printMargin: false,
  }
  constructor(private route: ActivatedRoute, private router: Router, private firestore: AngularFirestore) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('course')
    const lessonId = this.route.snapshot.paramMap.get('lesson')
    this.lessonId = lessonId
    this.exRef = this.firestore.collection<ExerciseData>(`course/${courseId}/lesson/${lessonId}/exercise`)
    this.exObservable = this.exRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id
          return { id, ...data }
        })
      )
    )
    this.exObservable.pipe(take(1)).subscribe((list) => {
      this.exList = list.sort((a, b) => a.index - b.index)
    })
    this.caseRef = this.firestore.collection<Testcase>('testcase', (ref) =>
      ref.where('lesson', '==', lessonId).orderBy('index')
    )
    this.caseObservale = this.caseRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id
          return { id, ...data }
        })
      )
    )
    this.caseObservale.pipe(take(1)).subscribe((list) => {
      this.caseList = list.sort((a, b) => a.index - b.index)
    })
  }
  add() {
    this.exList.push({
      id: this.exRef.ref.doc().id,
      title: '',
      index: this.exList.length,
      description: [],
      defaultCode: '# ここにコードを記入します\n',
      stdinEnabled: false,
    })
    console.log(this.exList)
  }
  async save() {
    const batch = this.firestore.firestore.batch()
    this.exList.map((v, i) => {
      const value: ExerciseDataId = { ...v }
      delete value.id
      v.index = i
      console.log(v.id)
      const ref = !v.id ? this.exRef.ref.doc() : this.exRef.doc<ExerciseData>(v.id).ref
      batch.set(ref, value)
    })
    this.removedId.map((id) => {
      batch.delete(this.exRef.doc(id).ref)
    })
    this.caseList.map((v, i) => {
      const value: TestcaseId = { ...v }
      delete value.id
      v.index = i
      console.log(v.id)
      const ref = !v.id ? this.caseRef.ref.doc() : this.caseRef.doc<Testcase>(v.id).ref
      batch.set(ref, value)
      v.id = ref.id
    })
    this.removedCaseId.map((id) => {
      batch.delete(this.caseRef.doc(id).ref)
    })
    try {
      await batch.commit()
      window.alert('更新完了')
    } catch (e) {
      window.alert('更新失敗' + e)
    }
  }
  exDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.exList, event.previousIndex, event.currentIndex)
    this.exList.forEach((v, i) => (v.index = i))
  }
  select(index: number) {
    this.exIndex = index
  }
  remove() {
    if (!confirm('演習問題を削除します')) return
    if (this.currentExerciseId !== null) {
      this.removedId.push(this.currentExerciseId)
    }
    this.exList.splice(this.exIndex, 1)
    if (this.exIndex > this.exList.length - 2) {
      this.exIndex = this.exList.length - 1
    }
  }
  addCase() {
    this.caseList.push({
      id: null,
      index: this.caseList.length,
      expected_output: '',
      language_id: 71,
      stdin: '',
      lesson: this.lessonId,
      exercise: this.currentExerciseId,
    })
  }
  removeCase(i: number) {
    if (this.caseList[i].id !== null) {
      this.removedCaseId.push(this.caseList[i].id)
    }
    this.caseList.splice(i, 1)
  }
  get currentExerciseId(): string {
    return this.exList[this.exIndex].id
  }
  finish() {
    this.save().then(() => {
      this.router.navigate(['/admin/material'])
    })
  }
}
