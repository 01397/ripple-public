import { Injectable } from '@angular/core'
import { Router, NavigationEnd, ActivatedRoute, NavigationStart, RoutesRecognized } from '@angular/router'
import { filter } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { Location } from '@angular/common'

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public headerVisiblity = new Subject<boolean>()
  public sidebarVisiblity = new Subject<boolean>()
  private get withHeader() {
    return ['/lesson', '/admin/slide-editor', '/admin/exercise-editor', '/admin/material']
  }
  private get withSidebar() {
    return ['/home', '/courses', '/notifications', '/settings']
  }

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
      const url = event.url.match(/^[^;?]*/)[0]
      if (this.withHeader.includes(url)) {
        this.headerVisiblity.next(true)
        this.sidebarVisiblity.next(false)
      } else if (this.withSidebar.includes(url)) {
        this.headerVisiblity.next(false)
        this.sidebarVisiblity.next(true)
      } else {
        this.headerVisiblity.next(false)
        this.sidebarVisiblity.next(false)
      }
    })
  }
}
