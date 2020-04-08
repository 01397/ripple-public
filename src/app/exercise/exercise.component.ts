import { Component, OnInit, OnDestroy } from '@angular/core'
import { ExerciseService, ExerciseData } from '../exercise.service'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit, OnDestroy {
  public exList: ExerciseData[] = []
  public exIndex: number = 0
  private destroy: Subject<void> = new Subject()
  public get unlockedIndex() {
    return this.exService.unlockedIndex
  }
  constructor(private exService: ExerciseService) {}

  ngOnInit() {
    this.exService.exList.pipe(takeUntil(this.destroy)).subscribe((list) => (this.exList = list))
    this.exService.exIndex.pipe(takeUntil(this.destroy)).subscribe((index) => (this.exIndex = index))
  }

  ngOnDestroy() {
    this.destroy.next()
  }
  changeExIndex(i: number) {
    this.exService.changeExIndex(i)
  }

  reviewSlide() {
    this.exService.reviewSlide()
  }
}
