import { Component, OnInit } from '@angular/core'

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

  constructor() {}

  ngOnInit() {}
}
