import { Component, ChangeDetectorRef } from '@angular/core'
import { AppService, AuthState } from './app.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ripple-public'
  headerVisiblity = false
  sidebarVisiblity = false
  authState: AuthState = 'unknown'
  constructor(private appService: AppService) {
    this.appService.headerVisiblity.subscribe((visibility) => {
      this.headerVisiblity = visibility
    })
    this.appService.sidebarVisiblity.subscribe((visibility) => {
      this.sidebarVisiblity = visibility
    })
    this.appService.authState.subscribe((authState) => {
      this.authState = authState
    })
  }
}
