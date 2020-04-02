import { Component, OnInit } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AppService } from 'app/app.service'
import { filter, take } from 'rxjs/operators'
import { UserItem } from 'firestore-item'

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
  public last: {
    course: string | null
    lesson: string | null
  } = { course: null, lesson: null }

  constructor(private db: AngularFirestore, private app: AppService) {}

  ngOnInit() {
    this.app.authState
      .pipe(
        filter((value) => value === 'authorised'),
        take(1)
      )
      .subscribe(() => {
        const uid = this.app.getUserId()
        this.db
          .doc<UserItem>('user/' + uid)
          .valueChanges()
          .pipe(take(1))
          .subscribe((snapshot) => {
            this.last = snapshot.lastLesson
          })
      })
  }
}
