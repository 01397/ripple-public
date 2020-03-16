import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { AngularFireAuth } from '@angular/fire/auth'
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: Observable<firebase.User>

  constructor(private angularFireAuth: AngularFireAuth) {}

  ngOnInit() {
    this.user = this.angularFireAuth.authState
  }

  logout() {
    this.angularFireAuth.auth.signOut()
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log(signInSuccessData)
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log(errorData)
  }
}
