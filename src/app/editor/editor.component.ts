import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import * as ace from 'ace-builds'
import { AceEditorComponent } from 'ng2-ace-editor'
import { WebsocketService } from '../websocket.service'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('editor', { static: false }) editor: AceEditorComponent
  text: string = ''
  options = { maxLines: 1000, printMargin: false }
  consoleText: string

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    ace.config.set('basePath', 'path')
    // this.websocketService.connect()
    // this.websocketService.judgeSubject.subscribe((result: string) => {
    //   console.log(result)
    //   // this.consoleText = result
    // })
  }

  onClick() {
    const data = {
      sourceCode: 'print(5)',
      course: '3neSkO6EH0v9EzZSZUV3',
      lesson: 'fH7LmyD7ahBVVAlmIPLN',
      exercise: 'm7l1Q8L0kShVJbWuPkDN',
    }
    this.websocketService.emit('judge', JSON.stringify(data))
  }
  ngOnDestroy() {
    this.websocketService.close()
  }
}
