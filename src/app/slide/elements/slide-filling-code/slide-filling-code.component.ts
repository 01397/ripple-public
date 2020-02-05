import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core'
import { SlideAbstractComponent } from '../slide-abstract-element.component'
import * as hljs from 'highlight.js'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { SlideService } from 'app/slide/slide.service'

export interface FillingCodeElementType {
  type: 'fillingCode'
  code: string
  lang: string
  blanks: BlankType[]
}
type BlankType = {
  size: number
  type: 'equalTo'
  values: string[]
}

@Component({
  selector: 'app-slide-filling-code',
  templateUrl: './slide-filling-code.component.html',
  styleUrls: ['./slide-filling-code.component.scss'],
})
export class SlideFillingCodeComponent extends SlideAbstractComponent {
  @Input() content: FillingCodeElementType
  @ViewChild('codeElement', { read: ViewContainerRef, static: false }) codeElm: ViewContainerRef
  public code: SafeHtml
  public compleated = false

  constructor(private sanitizer: DomSanitizer, private slideService: SlideService) {
    super()
  }

  ngOnInit() {
    const code = this.content.code
    const hlResult = hljs.highlight(this.content.lang, code)
    const text = hlResult.value.replace(/BLANK/gm, '<input type="text">')
    const html = this.sanitizer.bypassSecurityTrustHtml(text)
    this.code = html
    this.slideService.lock()
  }
  check() {
    const input = this.codeElm.element.nativeElement.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>
    const values = Array.from(input).map(v => v.value)
    const len = values.length
    let isAllCorrect = true
    for (let i = 0; i < len; i++) {
      const blank = this.content.blanks[i]
      const isCorrect = this.blankCheck(values[i], blank)
      isAllCorrect = isAllCorrect && isCorrect
      input[i].classList[isCorrect ? 'remove' : 'add']('wrong')
    }
    if (isAllCorrect) {
      this.compleated = true
      this.slideService.unlock()
    }
  }
  blankCheck(value: string, blank: BlankType) {
    switch (blank.type) {
      case 'equalTo':
        const value2 = value.replace(/ /gm, '')
        return blank.values.includes(value2)
    }
    return false
  }
  static generateData(): FillingCodeElementType {
    return {
      type: 'fillingCode',
      code: '',
      lang: 'python',
      blanks: [],
    }
  }
}
