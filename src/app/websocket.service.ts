import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import * as io from 'socket.io-client'
import { JudgeResult } from '../../routes/judge'

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: SocketIOClient.Socket
  public judgeSubject = new Subject<{ error: false; done: true; result: (number | null)[] }>()
  public execSubject = new Subject<JudgeResult>()

  constructor() {}

  connect() {
    this.socket = io()
    this.socket.on('connect', () => {
      this.log('connected')
    })
    this.socket.on('connect_error', (err: object) => {
      this.log('connect-error')
      console.log(err)
    })
    this.socket.on('connect_timeout', () => {
      this.log('connect_timeout')
    })
    this.socket.on('reconnect', (attempt: number) => {
      this.log(`reconnect (attempt: ${attempt})`)
    })
    this.socket.on('reconnect_attempt', (attempt: number) => {
      this.log(`reconnect_attempt (attempt: ${attempt})`)
    })
    this.socket.on('reconnecting', (attempt: number) => {
      this.log(`reconnecting (attempt: ${attempt})`)
    })
    this.socket.on('reconnect_error', (err: object) => {
      this.log('reconnect_error')
      console.log(err)
    })
    this.socket.on('ping', () => {
      this.log('ping')
    })
    this.socket.on('pong', (ms: number) => {
      this.log(`pong (${ms}ms)`)
    })
    this.socket.on('judge', (msg) => {
      this.log('judge ' + msg)
      this.judgeSubject.next(msg)
    })
    this.socket.on('execute', (msg: JudgeResult) => {
      this.log('execute ' + msg)
      this.execSubject.next(msg)
    })
  }

  close() {
    this.socket.close()
  }
  emit(name: string, msg: string) {
    this.log(name + ' ' + msg)
    this.socket.emit(name, msg)
  }

  log(msg: string) {
    console.log(`%cWebSocket%c ${msg}`, 'background-color: #ffaa00;color: #ffffff', 'color: #885500')
  }
}
