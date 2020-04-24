import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { AppService } from '../app.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public userName = ''
  private userNameSubscription: Subscription

  constructor(public app: AppService) {}

  ngOnInit() {
    this.userNameSubscription = this.app.getUser().subscribe((user) => {
      this.userName = user.displayName
    })
  }
  ngOnDestroy() {
    this.userNameSubscription.unsubscribe()
  }
}
