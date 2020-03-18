import { Component, OnInit } from '@angular/core'
import { AppService } from 'app/app.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public userName = this.app.getUserName()
  public title = 'Lesson 1. はじめての えいご'

  constructor(private app: AppService) {}

  ngOnInit() {}
}
