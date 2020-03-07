import { Component, OnInit } from '@angular/core'
import { SlideElementType } from 'app/slide/slide-item'

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {
  public exData: { index: number; title: string; description: SlideElementType[]; testcase: string[] }[] = [
    { index: 0, title: '練習だよ', description: [], testcase: [] },
    { index: 0, title: '練習だよ', description: [], testcase: [] },
    { index: 0, title: '練習だよ', description: [], testcase: [] },
  ]
  constructor() {}

  ngOnInit() {}
}
