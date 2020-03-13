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
  public text: string = ''
  public options = { maxLines: 1000, printMargin: false }
  public consoleText: string
  public execEnabled: boolean = true
  public get judgeEnabled() {
    return !this.exService.judging
  }

  constructor(private websocketService: WebsocketService, private exService: ExerciseService) {}

  ngOnInit() {
    ace.config.set('basePath', 'path')
    this.websocketService.connect()
    this.websocketService.execSubject.subscribe((result: JudgeResult) => {
      console.log(result)
      this.consoleText = window.atob(result.stdout)
      this.execEnabled = true
    })
    this.exService.exIndex.subscribe(index => {
      const defaultCode = this.exService.exList.value[index].defaultCode
      if (!defaultCode) {
        return
      }
      this.text = defaultCode
    })
  }
  execute() {
    const data = {
      language_id: 71,
      source_code: window.btoa(this.text),
      stdin: '',
    }
    this.websocketService.emit('execute', JSON.stringify(data))
    this.execEnabled = false
  }
  judge() {
    const data = {
      language_id: 71,
      source_code: window.btoa(this.text),
      exercise: this.exService.exId,
    }
    this.exService.judge(data)
  }
  ngOnDestroy() {
    this.websocketService.close()
  }
}
