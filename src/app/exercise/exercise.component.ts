import { Component, OnInit } from '@angular/core'
import { SlideElementType } from 'app/slide/slide-item'
import { ActivatedRoute } from '@angular/router'
import { AngularFirestore } from '@angular/fire/firestore'

export interface ExerciseData {
  index: number
  title: string
  description: SlideElementType[]
}

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {
  public exList: ExerciseData[] = [
    {
      index: 0,
      title: '読み込み中',
      description: [],
    },
  ]
  public exIndex: number = 0
  public unlockedIndex: number = 1
  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('course')
    const lessonId = this.route.snapshot.paramMap.get('lesson')
    this.firestore
      .collection('course')
      .doc(courseId)
      .collection('lesson')
      .doc(lessonId)
      .collection<ExerciseData>('exercise')
      .valueChanges()
      .subscribe(docs => {
        this.exList = docs.sort((a, b) => a.index - b.index)
      })
  }

  changeExIndex(i: number) {
    if (i > this.unlockedIndex) {
      return
    }
    this.exIndex = i
  }
}
