import { Component, OnInit } from '@angular/core'
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular'
import { AppService } from '../app.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private app: AppService) {}

  ngOnInit() {}

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log(signInSuccessData)
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log(errorData)
  }
}
