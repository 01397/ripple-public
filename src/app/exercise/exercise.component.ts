import { Component, OnInit } from '@angular/core'
import { ExerciseService, ExerciseData } from 'app/exercise.service'

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {
  public exList: ExerciseData[] = []
  public exIndex: number = 0
  constructor(private exService: ExerciseService) {}

  ngOnInit() {
    this.exService.exList.subscribe(list => (this.exList = list))
    this.exService.exIndex.subscribe(index => (this.exIndex = index))
  }

  changeExIndex(i: number) {
    this.exService.changeExIndex(i)
  }
}
