import { Injectable } from '@angular/core'
import { SlideData } from './slide-item'
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

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
  })
  /**
   * スライド番号の上限。
   */
  private limit: number
  public nav = new Subject<{ back: boolean; forward: boolean }>()

  constructor(private http: HttpClient) {}

  /**
   * 画面更新が必要なタイミングで呼び出す
   */
  updateSlide() {
    this.updateNav()
    this.slideSubject.next(this.slideData[this.index])
  }

  /**
   * スライドデータをset
   * @param slideData 新しいスライドデータ
   * @param index スライド番号
   */
  setSlideData(slideData: SlideData[], index: number = 0) {
    this.slideData = slideData
    this.limit = this.slideData.length
    this.index = index
    this.updateSlide()
  }

  fetchSlideData(slideID: string): Observable<{ id: number; body: SlideData[] }> {
    return this.http.get('api/lessons/' + slideID) as any
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
}
