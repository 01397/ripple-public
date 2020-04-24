import { Component, Input, OnInit } from '@angular/core'
import { AppService } from '../app.service'
import { LessonItemId } from '../../firestore-item'

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
