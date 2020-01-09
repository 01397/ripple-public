import { Component, OnInit, ViewChild } from '@angular/core'
import { AceEditorComponent } from 'ng2-ace-editor'
import * as ace from 'ace-builds'
import { WebsocketService } from '../websocket.service'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: AceEditorComponent
  text: string = ''
  options = { maxLines: 1000, printMargin: false }

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    ace.config.set('basePath', 'path')
    this.websocketService.connect()
  }

  onClick() {
    this.websocketService.emit('test message', this.text)
  }
}
