import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public menuItems = [
    { title: 'ホーム', path: '/home', icon: 'home' },
    { title: '学習', path: '/courses', icon: 'edit' },
    { title: 'お知らせ', path: '/notifications', icon: 'notifications' },
    { title: '設定', path: '/settings', icon: 'settings' },
  ]
  constructor() {}

  ngOnInit() {}
}
