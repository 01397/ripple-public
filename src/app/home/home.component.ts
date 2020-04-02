import { Component, OnInit } from '@angular/core'
import { AppService } from '../app.service'
import { take, filter } from 'rxjs/operators'
import { LessonItemId } from '../../firestore-item'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  notifications: { title: string; body: string; link?: { path: string; label: string } }[] = [
    {
      title: '教室説明会のお知らせ',
      body: 'キテネ〜〜サンプルテキストサンプルテキストサンプルテキストサンプルテキスト',
    },
  ]
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
}
