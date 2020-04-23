import { Component, OnInit } from '@angular/core'
import { AppService } from 'app/app.service'

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  public loggedin: boolean = false
  constructor(private app: AppService) {}

  ngOnInit() {
    this.loggedin = this.app.authState.value === 'authorised'
  }
}
