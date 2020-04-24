import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/storage'
import { MatSnackBar } from '@angular/material/snack-bar'
import { environment } from '../../environments/environment'
import { BehaviorSubject, Subject } from 'rxjs'
import { LessonItem } from '../../firestore-item'
import { LessonDisplay } from '../lesson/lesson.component'
import { SlideData, SlideItem, SlideType } from './slide-item'

@Injectable({
  providedIn: 'root',
})
export class SlideService {
  private slideData: SlideData[] = []
  public index: number
  public slideSubject = new BehaviorSubject<SlideData>({
    title: '読み込み中',
    slide: {
      type: 'oneColumn',
      title: '読み込み中',
      body: [
        {
          type: 'paragraph',
          body: 'しばらく経っても画面が切り替わらない場合は、もう一度お試しください',
        },
      ],
    },
    speech: {
      path: null,
      text: '',
    },
  })
  public slideTitle = new Subject<string>()
  public subtitlesSubject = new BehaviorSubject<string>('')
  /**
   * スライド番号の上限。
   */
  private limit: number
  public nav = new Subject<{ back: boolean; forward: boolean }>()

  public subtitleEnabled = true
  public muted = false
  public speechAudio = new Audio()
  public playState = new Subject<boolean>()
  private path: string
  public modeRequest: Subject<LessonDisplay> = new Subject()

  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private snackBar: MatSnackBar
  ) {}

  /**
   * 画面更新が必要なタイミングで呼び出す
   */
  updateSlide() {
    this.updateNav()
    this.slideSubject.next(this.slideData[this.index])
    this.subtitlesSubject.next(this.slideData[this.index].speech.text)
    this.speech()
  }

  /**
   * スライドデータをset
   * @param slideData 新しいスライドデータ
   * @param index スライド番号
   */
  setSlideData(path: string, index = 0) {
    if (path === 'dev') {
      return this.http.get('api/lessons/1') as any
    }
    this.path = path
    this.db
      .doc<LessonItem>(path)
      .valueChanges()
      .subscribe((result) => {
        console.log(result)
        this.slideTitle.next(result.title)
        this.slideData = result.slide.data
        if (this.slideData.length === 0) {
          this.slideData = [
            {
              title: 'title-slide test',
              slide: {
                type: 'cover',
                author: '〇〇 太郎',
                organization: '〇〇教室',
                course: '〇〇 Step 1',
                lesson: 'タイトルスライド',
              },
              speech: {
                path: null,
                text: '',
              },
            },
          ]
        }
        this.limit = this.slideData.length
        this.index = index
        this.updateSlide()
      })
  }

  getSlide() {
    return this.slideData
  }

  /**
   * 前のスライドへ
   * @returns 移動できたか?
   */
  back() {
    return this.go(this.index - 1)
  }

  /**
   * 次のスライドへ
   * @returns 移動できたか?
   */
  forward() {
    return this.go(this.index + 1)
  }

  /**
   * 特定のスライドへ
   * @param index スライド番号
   * @returns 移動できたか?
   */
  go(index: number, force = false) {
    if ((this.limit < index && !force) || index < 0) {
      return false
    }
    if (this.slideData.length - 1 < index) {
      this.modeRequest.next('exercise')
      return
    }
    this.index = index
    this.updateSlide()
    return true
  }

  /**
   * 画面表示更新
   */
  reflesh() {
    this.go(this.index, true)
  }

  /**
   * 閲覧可能なスライド番号の上限
   * @param limit スライド番号
   */
  setLimit(limit: number): boolean {
    if (limit < 0) {
      return false
    }
    this.limit = limit
    return true
  }

  /**
   * 前後ボタンの行き先を更新
   */
  updateNav() {
    this.nav.next({
      back: this.index > 0,
      forward: /* this.index < this.slideData.length - 1 && */ this.index < this.limit,
    })
  }

  lock() {
    this.limit = this.index
    this.updateNav()
  }
  unlock() {
    this.limit = this.slideData.length
    this.updateNav()
  }
  speechTest(value: string) {
    const ssml =
      '<speak>' +
      value.replace(/<(.+?s)>/g, '<break time="$1"/>').replace(/\[(.+?)\|(.+?)\]/g, '<sub alias="$2">$1</sub>') +
      '</speak>'
    const src =
      (environment.production ? '' : 'https://ripple-public.appspot.com') + '/api/tts?ssml=' + encodeURIComponent(ssml)
    this.speechAudio.src = src
    this.speechAudio.play()
  }
  async speech() {
    this.speechAudio.pause()
    const path = this.slideData[this.index].speech.path
    if (!path) {
      return
    }
    const src = await this.storage.ref(path).getDownloadURL().toPromise()
    this.speechAudio.src = src
    this.speechAudio.play()
    this.playState.next(true)
    this.speechAudio.addEventListener('ended', () => {
      this.playState.next(false)
    })
  }

  /**
   * 字幕の表示 / 非表示
   */
  toggleSubtitles() {
    this.subtitleEnabled = !this.subtitleEnabled
    // 字幕を更新させると、slide-containerのadjustScaleが呼ばれる
    if (!this.subtitleEnabled) {
      this.subtitlesSubject.next('(字幕はオフになっています)')
    } else {
      this.subtitlesSubject.next(this.slideData[this.index].speech.text)
    }
  }

  /**
   * 音声のオンオフ
   */
  toggleMute() {
    this.muted = !this.muted
    this.speechAudio.muted = this.muted
  }

  save() {
    return this.db
      .doc(this.path)
      .update({ slide: { data: this.slideData } })
      .then(() =>
        this.snackBar.open('保存しました', null, {
          duration: 1500,
          horizontalPosition: 'right',
        })
      )
      .catch((e) => {
        this.snackBar.open('保存できませんでした。', null, {
          duration: 3000,
          horizontalPosition: 'right',
        })
      })
  }

  addSlide(type: SlideType['type']) {
    const slide = SlideItem.generateSlide(type)
    const data: SlideData = {
      title: '新規スライド',
      slide,
      speech: {
        path: null,
        text: '',
      },
    }
    this.slideData.push(data)
    this.updateSlide()
  }

  removeSlide(index: number) {
    this.slideData.splice(index, 1)
  }

  /**
   * 読み上げ音声を停止する
   */
  stopAudio() {
    this.speechAudio.pause()
  }
}
