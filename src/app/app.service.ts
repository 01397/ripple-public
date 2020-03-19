import { Injectable } from '@angular/core'
import { Router, NavigationStart } from '@angular/router'
import { filter } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public headerVisiblity = new Subject<boolean>()
  public sidebarVisiblity = new Subject<boolean>()
  public headerTitle: string
  private get withHeader() {
    return ['/lesson']
    // return ['/lesson', '/admin/slide-editor', '/admin/exercise-editor', '/admin/material']
  }
  private get withSidebar() {
    return ['/home', '/courses', '/notifications', '/settings']
  }
  private user: firebase.User

  constructor(private router: Router, private angularFireAuth: AngularFireAuth, private db: AngularFirestore) {
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
    this.angularFireAuth.authState.subscribe(user => {
      console.log(this.user)
      this.user = user
    })
  }
  public getUser() {
    return this.user
  }
  public getUserName() {
    return this.user ? this.user.displayName : null
  }
  public login() {}
  public logout() {
    this.angularFireAuth.auth.signOut()
  }
  public setHeaderTitle(title: string) {
    this.headerTitle = title
  }
}
