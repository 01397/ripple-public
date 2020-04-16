import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import * as ace from 'ace-builds'
import { AceEditorComponent } from 'ng2-ace-editor'
import { WebsocketService } from '../websocket.service'
import { JudgeResult } from '../../../routes/judge'
import { ExerciseService } from '../exercise.service'
import { translate as peg, ExceptionGuide } from '../pyExceptionGuide'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('editor', { static: false }) editor: AceEditorComponent
  public text: string = ''
  public options = { maxLines: 1000, printMargin: false }
  public stdinOptions = { maxLines: 1000, printMargin: false, showGutter: false }
  public stdinEnabled: boolean = false
  public stdin: string = ''
  public stdout: string
  public stderr: string
  public errGuide: ExceptionGuide | null
  public executing: boolean = false
  public execError: boolean = false
  public guideVisibility: boolean = false
  private destroy: Subject<void> = new Subject()
  public get judgeEnabled() {
    return !this.exService.judging
  }

  constructor(private websocketService: WebsocketService, private exService: ExerciseService) {}

  ngOnInit() {
    ace.config.set('basePath', 'path')
    this.websocketService.connect()
    this.websocketService.execSubject.pipe(takeUntil(this.destroy)).subscribe((result: JudgeResult) => {
      this.stdout = decodeURIComponent(escape(atob(result.stdout ?? '')))
      this.stderr = decodeURIComponent(escape(atob(result.stderr ?? '')))
      this.errGuide = peg(this.stderr)
      this.guideVisibility = true
      this.executing = false
    })
    this.exService.exIndex.pipe(takeUntil(this.destroy)).subscribe((index) => {
      const exData = this.exService.exList.value[index]
      const defaultCode = exData.defaultCode
      if (!defaultCode) {
        return
      }
      this.stdinEnabled = exData.stdinEnabled ?? false
      this.text = defaultCode
      this.stdout = ''
      this.stderr = ''
    })
  }
  getCode() {
    const code = this.text
    return window.btoa(window.unescape(window.encodeURIComponent(code)))
  }
  getStdin() {
    return window.btoa(window.unescape(window.encodeURIComponent(this.stdin)))
  }
  execute() {
    const data = {
      language_id: 71,
      source_code: this.getCode(),
      stdin: this.getStdin(),
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
    this.destroy.next()
  }
  closeGuide() {
    this.guideVisibility = false
  }
}
