import { Component, OnInit } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router'
import { AppService } from '../app.service'
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular'
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private app: AppService, private db: AngularFirestore) {}

  ngOnInit() {}

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log(signInSuccessData)
    const uid = signInSuccessData?.authResult?.user?.uid
    if (!uid) {
      this.errorCallback()
    }
    this.db
      .doc('user/' + uid)
      .get()
      .pipe(take(1))
      .subscribe((snapshot) => {
        if (!snapshot.exists) {
          this.router.navigate(['/signup'])
        } else {
          this.router.navigate(['/home'])
        }
      })
  }

  errorCallback(errorData?: FirebaseUISignInFailure) {
    console.log(errorData)
    alert('ログインできません')
  }
}
