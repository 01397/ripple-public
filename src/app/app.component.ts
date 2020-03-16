import { Component } from '@angular/core'
import { AppService } from './app.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ripple-public'
  headerVisiblity = false
  sidebarVisiblity = false
  constructor(private appService: AppService) {
    this.appService.headerVisiblity.subscribe(visibility => {
      this.headerVisiblity = visibility
    })
    this.appService.sidebarVisiblity.subscribe(visibility => {
      this.sidebarVisiblity = visibility
    })
  }
}
