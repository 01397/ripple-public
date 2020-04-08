import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import * as ace from 'ace-builds'
import { AceEditorComponent } from 'ng2-ace-editor'
import { WebsocketService } from '../websocket.service'
import { JudgeResult } from '../../../routes/judge'
import { ExerciseService } from '../exercise.service'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('editor', { static: false }) editor: AceEditorComponent
  public text: string = ''
  public options = { maxLines: 1000, printMargin: false }
  public consoleText: string
  public executing: boolean = false
  public execError: boolean = false
  public get judgeEnabled() {
    return !this.exService.judging
  }

  constructor(private websocketService: WebsocketService, private exService: ExerciseService) {}

  ngOnInit() {
    ace.config.set('basePath', 'path')
    this.websocketService.connect()
    this.websocketService.execSubject.subscribe((result: JudgeResult) => {
      let output: string
      if (result.stderr !== null) {
        output = result.stderr
        this.execError = true
      } else if (result.stdout !== null) {
        output = result.stdout
        this.execError = false
      } else {
        output = ''
        this.execError = false
      }
      this.consoleText = decodeURIComponent(escape(atob(output)))
      this.executing = false
    })
    this.exService.exIndex.subscribe((index) => {
      const defaultCode = this.exService.exList.value[index].defaultCode
      if (!defaultCode) {
        return
      }
      this.text = defaultCode
      this.consoleText = ''
    })
  }
  getCode() {
    const code = this.text
    return window.btoa(window.unescape(window.encodeURIComponent(code)))
  }
  execute() {
    const data = {
      language_id: 71,
      source_code: this.getCode(),
      stdin: '',
    }
    this.websocketService.emit('execute', JSON.stringify(data))
    this.executing = true
  }
  judge() {
    const data = {
      language_id: 71,
      source_code: this.getCode(),
      exercise: this.exService.exId,
    }
    this.exService.judge(data)
  }
  ngOnDestroy() {
    this.websocketService.close()
  }
}
