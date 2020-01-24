import { Injectable } from '@angular/core'
import { SlideData } from './slide-item'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SlideService {
  private slideData: SlideData[] = []
  private index: number
  public slideSubject = new BehaviorSubject<SlideData>({
    title: 'エラー',
    type: 'OneColumn',
    data: { title: 'エラーが発生しました', body: 'もう一度お試しください' },
  })
  /**
   * スライド番号の上限。
   */
  private limit: number

  constructor() {}

  /**
   * 画面更新が必要なタイミングで呼び出す
   */
  updateSlide() {
    this.slideSubject.next(this.slideData[this.index])
  }

  /**
   * スライドデータをset
   * @param slideData 新しいスライドデータ
   * @param index スライド番号
   */
  setSlideData(slideData: SlideData[], index: number = 0) {
    console.log(slideData)
    this.slideData = slideData
    this.limit = Number.MAX_SAFE_INTEGER
    this.index = index
    this.updateSlide()
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
  go(index: number) {
    if (this.limit < index || index < 0 || this.slideData.length - 1 < index) {
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
}
