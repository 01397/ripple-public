import { Injectable } from '@angular/core'
import { SlideData, SlideType, SlideItem } from './slide-item'
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { AngularFirestore } from '@angular/fire/firestore'
import { LessonItem } from 'firestore-item'

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
      text: '',
    },
  })
  public slideTitle = ''
  public subtitlesSubject = new BehaviorSubject<string>('')
  /**
   * スライド番号の上限。
   */
  private limit: number
  public nav = new Subject<{ back: boolean; forward: boolean }>()

  public subtitleEnabled = true
  public muted = false
  public speechAudio = new Audio()
  path: string

  constructor(private http: HttpClient, private db: AngularFirestore) {}

  /**
   * 画面更新が必要なタイミングで呼び出す
   */
  updateSlide() {
    this.updateNav()
    this.slideSubject.next(this.slideData[this.index])
    this.subtitlesSubject.next(this.slideData[this.index].speech.text)
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
      .subscribe(result => {
        console.log(result)
        this.slideTitle = result.title
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
    if ((this.limit < index && !force) || index < 0 || this.slideData.length - 1 < index) {
      return false
    }
    this.index = index
    this.updateSlide()
    return true
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
      forward: this.index < this.slideData.length - 1 && this.index < this.limit,
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

  speech() {
    this.speechAudio.pause()
    const ssml =
      '<speak>' +
      this.slideData[this.index].speech.text
        .replace(/<(.+?s)>/g, '<break time="$1"/>')
        .replace(/\[(.+?)\|(.+?)\]/g, '<sub alias="$2">$1</sub>') +
      '</speak>'
    this.speechAudio.src = 'api/tts?ssml=' + ssml
    this.speechAudio.play()
  }
  toggleSubtitles() {
    this.subtitleEnabled = !this.subtitleEnabled
    // 字幕を更新させると、slide-containerのadjustScaleが呼ばれる
    if (!this.subtitleEnabled) {
      this.subtitlesSubject.next('(字幕はオフになっています)')
    } else {
      this.subtitlesSubject.next(this.slideData[this.index].speech.text)
    }
  }

  save() {
    this.db.doc(this.path).update({ slide: { data: this.slideData } })
  }

  addSlide(type: SlideType['type']) {
    const slide = SlideItem.generateSlide(type)
    const data: SlideData = {
      title: '新規スライド',
      slide,
      speech: {
        text: '',
      },
    }
    this.slideData.push(data)
    this.updateSlide()
  }
}
