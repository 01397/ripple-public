import { Component, OnInit } from '@angular/core'
import { AppService } from '../app.service'

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {
  public string: string
  public read: boolean = false
  public agreeStatus: number = 0
  constructor(private app: AppService) {}

  ngOnInit(): void {
    this.getTerms()
  }
  async getTerms() {
    const src = '/api/terms'
    const response = await fetch(src)
    const html = await response.text()
    this.string = html
  }
  async getPolicy() {
    const src = '/api/privacy'
    const response = await fetch(src)
    const html = await response.text()
    this.string = html
  }
  agree() {
    this.agreeStatus++
    if (this.agreeStatus === 1) {
      this.read = false
      this.string = ''
      this.getPolicy().then(() => {
        this.read = false
      })
    } else if (this.agreeStatus === 2) {
      this.app.agree()
    }
  }
  onScroll(event: Event) {
    const target = event.currentTarget as HTMLDivElement
    // ブラウザの表示倍率によって、1未満の誤差が出る
    if (target.scrollHeight - target.clientHeight - target.scrollTop < 10) {
      this.read = true
    }
  }
}
