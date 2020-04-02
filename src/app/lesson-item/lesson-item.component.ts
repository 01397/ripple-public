import { Component, OnInit, Input } from '@angular/core'
import { LessonItemId } from 'firestore-item'
import { AppService } from 'app/app.service'

@Component({
  selector: 'app-lesson-item',
  templateUrl: './lesson-item.component.html',
  styleUrls: ['./lesson-item.component.scss'],
})
export class LessonItemComponent implements OnInit {
  @Input() public lesson: LessonItemId
  public count: number
  public last: Date | null
  public face: string

  constructor(private app: AppService) {}

  ngOnInit() {
    this.last = this.app.getLessonLastStudy(this.lesson.courseId, this.lesson.id)
    this.count = this.app.getLessonStudyCount(this.lesson.courseId, this.lesson.id)
    this.face = this.app.getFaceSrc(this.lesson.courseId, this.lesson.id)
  }
}
