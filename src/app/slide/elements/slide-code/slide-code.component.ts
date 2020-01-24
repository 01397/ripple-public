import { Component, OnInit, ViewChild, Input } from '@angular/core'
import { AceEditorComponent } from 'ng2-ace-editor'

@Component({
  selector: 'app-slide-code',
  templateUrl: './slide-code.component.html',
  styleUrls: ['./slide-code.component.scss'],
})
export class SlideCodeComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: AceEditorComponent
  @Input() lang: string
  @Input() code: string
  @Input() fontSize: number = 24
  options = { maxLines: 1000, printMargin: false, fontSize: this.fontSize }
  consoleText: string

  constructor() {}

  ngOnInit() {}
}
