import { Component, ViewChild, Input } from '@angular/core'
import { AceEditorComponent } from 'ng2-ace-editor'
import { SlideAbstractComponent } from '../slide-abstract-element.component'

export interface CodeElementType {
  type: 'code'
  lang: string
  code: string
  fontSize?: number
}

@Component({
  selector: 'app-slide-code',
  templateUrl: './slide-code.component.html',
  styleUrls: ['./slide-code.component.scss'],
})
export class SlideCodeComponent extends SlideAbstractComponent {
  @ViewChild('editor', { static: false }) editor: AceEditorComponent
  @Input() content: CodeElementType
  public options = { maxLines: 1000, printMargin: false, fontSize: 24 }
  consoleText: string

  ngOnInit() {
    if (this.content.fontSize) {
      this.options.fontSize = this.content.fontSize
    }
  }
}
