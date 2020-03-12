import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import * as ace from 'ace-builds'
import { AceEditorComponent } from 'ng2-ace-editor'
import { WebsocketService } from '../websocket.service'
import { JudgeResult } from '../../../routes/judge'
import { ExerciseService } from 'app/exercise.service'

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

  constructor(private websocketService: WebsocketService, private exService: ExerciseService) {}

  ngOnInit() {
    ace.config.set('basePath', 'path')
    this.websocketService.connect()
    this.websocketService.judgeSubject.subscribe((result: JudgeResult) => {
      console.log(result)
      // this.consoleText = result
    })
    this.websocketService.execSubject.subscribe((result: JudgeResult) => {
      console.log(result)
      this.consoleText = window.atob(result.stdout)
    })
  }
  execute() {
    const data = {
      language_id: 71,
      source_code: window.btoa(this.text),
      stdin: '',
    }
    this.websocketService.emit('execute', JSON.stringify(data))
  }
  judge() {
    const data = {
      language_id: 71,
      source_code: window.btoa(this.text),
      exercise: this.exService.exId,
    }
    this.websocketService.emit('judge', JSON.stringify(data))
  }
  ngOnDestroy() {
    this.websocketService.close()
  }
}
