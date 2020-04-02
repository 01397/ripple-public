import { Injectable } from '@angular/core'
import { Router, NavigationStart } from '@angular/router'
import { filter, map, take } from 'rxjs/operators'
import { Subject, BehaviorSubject } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'

export type AuthState = 'unknown' | 'unauthorized' | 'authorised' | 'unregistered'

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
      this.user = user
      if (this.user !== null && !!user?.uid) {
        this.db
          .doc('user/' + user.uid)
          .get()
          .pipe(take(1))
          .subscribe((snapshot) => {
            if (snapshot.exists) {
              this.authState.next('authorised')
            } else {
              router.navigate(['signup'])
              this.authState.next('unregistered')
            }
          })
      } else {
        this.authState.next('unauthorized')
      }
    })
  }
  public getUser() {
    return this.auth.user
  }
  /**
   * ユーザーIDの取得
   * authStateが 'authorised' or 'unregistered' である事を確認してから使用する
   */
  public getUserId() {
    const state = this.authState.value
    if (state === 'unauthorized' || state === 'unknown') {
      console.warn('未認証です')
    }
    return this.user?.uid ?? null
  }
  /**
   * ユーザー名の取得
   * authStateが 'authorised' or 'unregistered' である事を確認してから使用する
   */
  public getUserName() {
    const state = this.authState.value
    if (state === 'unauthorized' || state === 'unknown') {
      console.warn('未認証です')
    }
    return this.user?.displayName ?? null
  }
  public logout() {
    this.auth.auth.signOut()
  }
  public setHeaderTitle(title: string) {
    this.headerTitle = title
  }
}
