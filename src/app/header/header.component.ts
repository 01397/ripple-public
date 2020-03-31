import { Component, OnInit } from '@angular/core'
import { AppService } from '../app.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public userName = ''

  constructor(public app: AppService) {}

  ngOnInit() {
    this.app.getUser().subscribe((user) => {
      this.userName = user.displayName
    })
  }
}
