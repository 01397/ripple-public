import { Component, OnInit } from '@angular/core'
import { AngularFireAnalytics } from '@angular/fire/analytics'

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
  constructor(private analytics: AngularFireAnalytics) {}

  gaHP() {
    this.analytics.logEvent('ext_link', { url: 'https://www.uec-programming.com', trigger: 'sidebar_button' })
  }
  ngOnInit() {}
}
