import { Component, OnInit, OnDestroy } from '@angular/core'
import { AppService } from '../app.service'
import { Subscription } from 'rxjs'

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
