import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { Route, Routes, Router } from '@angular/router'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  ngOnInit() {}

  public logout() {
    this.auth.auth.signOut().then(() => {
      this.router.navigate(['login'])
    })
  }
}
