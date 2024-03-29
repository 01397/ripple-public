import { Component, OnInit } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router'
import { firestore } from 'firebase'
import { take } from 'rxjs/operators'
import { UserItem } from '../../firestore-item'
import { AppService } from '../app.service'
import * as constants from '../constants'
import { AngularFireAnalytics } from '@angular/fire/analytics'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  /**
   * ユーザー名
   */
  public name: string = ''
  /**
   * ユーザー名の最小文字数
   */
  public minNameLength = 3
  /**
   * ユーザー名の最大文字数
   */
  public maxNameLength = 50
  // 性別
  public gender: number = null
  public genderList = constants.gender
  // 年代
  public age: number = null
  public ageList = constants.age
  // 職業
  public job: number = null
  public jobList = constants.job
  // 使用目的
  public purpose: number = null
  public purposeList = constants.purpose
  // 地域
  public region: number = null
  public regionList = constants.region
  public region2: number = null
  public region2List = constants.region2
  // きっかけ
  public trigger: number = null
  public triggerList = constants.trigger
  // 関心
  public interestList = constants.interest
  public interest: Array<boolean> = new Array(this.interestList.length).fill(false)
  // 経験
  public experience: number = 0
  /**
   * 送信中か？
   */
  public inProgress: boolean = false

  constructor(
    private db: AngularFirestore,
    private app: AppService,
    private router: Router,
    private analytics: AngularFireAnalytics
  ) {}
  ngOnInit() {
    this.app.authState.pipe(take(1)).subscribe((value) => {
      if (value === 'unregistered') {
        this.name = this.app.getUserName() ?? ''
      } else if (value === 'authorised') {
        this.router.navigate(['/home'])
      }
    })
  }

  nameCheck1() {
    return this.name.length !== 0
  }
  nameCheck2() {
    const len = this.name.length
    return this.minNameLength <= len && len <= this.maxNameLength
  }
  experienceCheck() {
    return 0 <= this.experience && this.experience < 100
  }
  getInterest() {
    const arr = this.interest
    const len = arr.length
    const result: number[] = []
    for (let i = 0; i < len; i++) {
      if (arr[i]) {
        result.push(i)
      }
    }
    return result
  }
  submittionCheck() {
    return (
      this.nameCheck1() &&
      this.nameCheck2() &&
      this.gender !== null &&
      this.age !== null &&
      this.job !== null &&
      this.purpose !== null &&
      (this.region !== null || (this.region2 !== null && this.region2List[this.region2].value !== null)) &&
      this.trigger !== null &&
      this.interest.includes(true) &&
      this.experience !== null &&
      this.experienceCheck()
    )
  }
  async submit() {
    if (this.app.authState.value !== 'unregistered') {
      throw new Error('ログインしていないため、登録できません')
    }
    const data: UserItem = {
      name: this.name,
      gender: this.gender,
      age: this.age,
      job: this.job,
      purpose: this.purpose,
      region: this.region ?? this.region2List[this.region2].value,
      trigger: this.trigger,
      interest: this.getInterest(),
      experience: this.experience,
      lastLesson: null,
      agreement: null,
      modified: firestore.FieldValue.serverTimestamp(),
    }
    this.inProgress = true
    const userID = this.app.getUserId()
    Promise.all([
      this.db.doc(`user/${userID}`).set(data, { merge: true }),
      this.app
        .getUser()
        .pipe(take(1))
        .subscribe((user) => {
          user.updateProfile({ displayName: this.name })
        }),
    ])
      .then(() => {
        this.analytics.logEvent('sign_up', { method: this.app.getAuthProvider() })
        this.app.authState.next('unagreed')
        this.router.navigate(['/home'])
      })
      .catch(() => {
        alert('登録処理ができませんでした')
      })
  }
}
