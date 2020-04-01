import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { Route, Routes, Router } from '@angular/router'
import { AppService } from 'app/app.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public get userName() {
    return this.app.getUserName()
  }
  constructor(private auth: AngularFireAuth, private router: Router, private app: AppService) {}

  ngOnInit() {}

  public logout() {
    this.auth.auth.signOut().then(() => {
      this.router.navigate(['login'])
    })
  }
}
