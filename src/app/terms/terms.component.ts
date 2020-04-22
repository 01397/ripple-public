import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {
  public termsString: string
  constructor() {}

  ngOnInit(): void {
    this.getTerms()
  }
  async getTerms() {
    const src = '/api/terms'
    const response = await fetch(src)
    const html = await response.text()
    this.termsString = html
  }
}
