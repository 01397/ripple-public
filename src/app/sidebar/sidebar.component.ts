import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public menuItems = [
    { title: 'ホーム', path: '/home' },
    { title: '学習', path: '/courses' },
    { title: 'お知らせ', path: '/notifications' },
    { title: '設定', path: '/settings' }
  ]
  constructor() {}

  ngOnInit() {}
}
