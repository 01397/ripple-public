import { Injectable } from '@angular/core'
import { Router, NavigationStart } from '@angular/router'
import { filter, map, take } from 'rxjs/operators'
import { Subject, BehaviorSubject } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'

export type AuthState = 'unknown' | 'unauthorized' | 'authorised'

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public headerVisiblity = new Subject<boolean>()
  public sidebarVisiblity = new Subject<boolean>()
  public headerTitle: string
  public authState = new BehaviorSubject<AuthState>('unknown')
  private get withHeader() {
    return ['/lesson', '/admin/material']
    // return ['/lesson', '/admin/slide-editor', '/admin/exercise-editor', '/admin/material']
  }
  private get withSidebar() {
    return ['/home', '/courses', '/notifications', '/settings']
  }
  private user: firebase.User

  constructor(private router: Router, private auth: AngularFireAuth, private db: AngularFirestore) {
    this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
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
    this.auth.authState.subscribe((user) => {
      console.log(user)
      this.user = user
      if (this.user !== null) {
        this.authState.next('authorised')
      } else {
        this.authState.next('unauthorized')
      }
    })
  }
  public getUser() {
    return this.auth.user
  }
  public getUserId() {
    return this.user?.uid ?? null
  }
  public getUserName() {
    return this.user?.displayName ?? null
  }
  public login() {}
  public logout() {
    this.auth.auth.signOut()
  }
  public setHeaderTitle(title: string) {
    this.headerTitle = title
  }
}
