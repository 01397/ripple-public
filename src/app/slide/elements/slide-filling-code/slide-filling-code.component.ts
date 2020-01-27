import { Component, Input, ViewChild, ViewContainerRef, AfterViewInit, ElementRef } from '@angular/core'
import { SlideAbstractComponent } from '../slide-abstract-element.component'
import * as hljs from 'highlight.js'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

export interface FillingCodeElementType {
  type: 'fillingCode'
  code: string
  blanks: [
    {
      size: number
      check: BlankCheckType
    }
  ]
}
type BlankCheckType = {
  type: 'equalsTo'
  ch: [string, string]
}

@Component({
  selector: 'app-slide-filling-code',
  templateUrl: './slide-filling-code.component.html',
  styleUrls: ['./slide-filling-code.component.scss'],
})
export class SlideFillingCodeComponent extends SlideAbstractComponent {
  @Input() content: FillingCodeElementType
  public code: SafeHtml

  constructor(private sanitizer: DomSanitizer) {
    super()
  }

  ngOnInit() {
    const code = this.content.code
    const hlResult = hljs.highlight('python', code)
    const text = hlResult.value.replace(/BLANK/gm, '<input type="text">')
    const html = this.sanitizer.bypassSecurityTrustHtml(text)
    this.code = html
  }
}
