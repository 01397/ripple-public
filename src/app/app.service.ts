import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import { NavigationEnd, Router } from '@angular/router'
import { firestore } from 'firebase'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { filter, take } from 'rxjs/operators'
import { LessonItemId, LessonRecordItem, PickupItem, SystemStatus, UserItem } from '../firestore-item'
import { Title } from '@angular/platform-browser'

export type AuthState = 'unknown' | 'unauthorized' | 'unregistered' | 'unagreed' | 'authorised'

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public headerVisiblity = new Subject<boolean>()
  public sidebarVisiblity = new Subject<boolean>()
  public headerTitle: string = ''
  public authState = new BehaviorSubject<AuthState>('unknown')
  public lastLesson = new BehaviorSubject<LessonItemId | null>(null)
  public pickupList: Observable<PickupItem[]>
  private system: SystemStatus
  private get withHeader() {
    return ['/lesson', '/admin/material']
  }
  private get withSidebar() {
    return ['/home', '/courses', '/notifications', '/settings']
  }
  private get titleList() {
    return { '/home': 'ホーム', '/courses': 'コース一覧', '/notifications': 'お知らせ', '/settings': '設定' }
  }
  private user: firebase.User
  private record: {
    [x: string]: { count: number; last: Date; lessons: { [x: string]: { count: number; last: Date; face: number } } }
  } = {}
  private _lessonCount: number
  public get lessonCount() {
    return this._lessonCount
  }

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private title: Title
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects.match(/^[^;?]*/)[0]
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
      const pageTitle = this.titleList[url] ?? null
      if (pageTitle) {
        this.title.setTitle(pageTitle + ' | Ripple')
      }
    })
    this.getSystemStatus().then(() => {
      this.initAuthWatcher()
    })
  }
  private initAuthWatcher() {
    this.auth.authState.subscribe((user) => {
      this.user = user
      if (this.user !== null && !!user?.uid) {
        this.db
          .doc('user/' + user.uid)
          .get()
          .pipe(take(1))
          .subscribe((snapshot) => {
            if (!snapshot.exists) {
              this.router.navigate(['signup'])
              this.authState.next('unregistered')
              return
            }
            const data = snapshot.data() as UserItem
            const agreement = data?.agreement?.valueOf() ?? null
            this.getRecords()
            this.getPickup()
            if (agreement === null || this.system.terms_update.valueOf() > agreement) {
              this.authState.next('unagreed')
            } else {
              this.authState.next('authorised')
            }
          })
      } else {
        this.authState.next('unauthorized')
      }
    })
  }
  private async getSystemStatus() {
    this.db
      .doc('system/status')
      .valueChanges()
      .subscribe((snapshot: SystemStatus) => {
        this.system = snapshot
      })
  }

  /**************** USER ****************/
  /**
   * Userの取得
   */
  public getUser() {
    return this.auth.user
  }
  public getAuthProvider() {
    return this.user.providerId ?? 'unknown'
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

  /*************** HEADER ***************/
  public setHeaderTitle(title: string) {
    // ExpressionChangedAfterItHasBeenCheckedError を回避するために非同期関数を利用
    setTimeout(() => {
      this.headerTitle = title
      this.title.setTitle(title + ' | Ripple')
    })
  }

  /********* COURSE and LESSONS *********/
  private getRecords() {
    const uid = this.getUserId()
    // 学習記録を全て取得
    const lessonRecordPath = `user/${uid}/lesson_record`
    this.db
      .collection<LessonRecordItem>(lessonRecordPath)
      .valueChanges()
      .subscribe((docs) => {
        this._lessonCount = docs.length
        const record: {
          [key in string]: {
            count: number
            last: Date
            lessons: { [key2 in string]: { count: number; last: Date; face: number | null } }
          }
        } = {}
        for (const doc of docs) {
          if (!record[doc.course]) {
            record[doc.course] = { count: 0, lessons: {}, last: null }
          }
          const { count, last, face } = doc
          const lastDate = (last as firebase.firestore.Timestamp)?.toDate() ?? null
          const course = record[doc.course]
          course.lessons[doc.lesson] = { count: count as number, last: lastDate, face }
          course.count++
          if (course.last === null) {
            course.last = lastDate
          } else if (lastDate !== null && course.last < lastDate) {
            course.last = lastDate
          }
        }
        this.record = record
      })
    //
    this.db
      .doc<UserItem>('user/' + uid)
      .valueChanges()
      .pipe(take(1))
      .subscribe((snapshot) => {
        if (!snapshot.lastLesson) return
        const { course, lesson } = snapshot.lastLesson
        this.db
          .doc<LessonItemId>(`course/${course}/lesson/${lesson}`)
          .valueChanges()
          .pipe(take(1))
          .subscribe((lessonItem) => {
            this.lastLesson.next({ id: lesson, courseId: course, ...lessonItem })
          })
      })
  }
  public getCourseLastStudy(id: string) {
    return this.record[id]?.last ?? null
  }
  public getCourseProgress(id: string) {
    return this.record[id]?.count ?? 0
  }
  public getLessonLastStudy(courseId: string, lessonId: string) {
    return this.record[courseId]?.lessons[lessonId]?.last ?? null
  }
  public getLessonStudyCount(courseId: string, lessonId: string) {
    return this.record[courseId]?.lessons[lessonId]?.count ?? null
  }
  public getFaceSrc(courseId: string, lessonId: string) {
    const face = this.record[courseId]?.lessons[lessonId]?.face ?? null
    if (face === null) {
      return `../../assets/images/face_blank.svg`
    } else {
      return `../../assets/images/face_${face}.svg`
    }
  }

  /***** PICKUP *****/
  private getPickup() {
    this.pickupList = this.db
      .collection<PickupItem>('pickup', (ref) => ref.where('private', '==', false))
      .valueChanges()
  }

  public agree() {
    this.authState.next('authorised')
    this.db.doc<UserItem>('user/' + this.getUserId()).update({
      agreement: firestore.FieldValue.serverTimestamp(),
    })
  }
}
