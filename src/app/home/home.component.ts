import { Component, OnInit } from '@angular/core'
import { filter, take } from 'rxjs/operators'
import { LessonItemId } from '../../firestore-item'
import { AppService } from '../app.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public lastLesson: LessonItemId = null
  constructor(private app: AppService) {}

  ngOnInit() {
    this.app.lastLesson
      .pipe(
        filter((val) => val !== null),
        take(1)
      )
      .subscribe((lesson) => {
        this.lastLesson = lesson
      })
  }
  getPickupList() {
    return this.app.pickupList
  }
}
