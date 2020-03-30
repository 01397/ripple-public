import { Pipe, PipeTransform } from '@angular/core'
import { firestore } from 'firebase'

@Pipe({
  name: 'fromNow',
})
export class FromNowPipe implements PipeTransform {
  transform(value: Date | firestore.Timestamp): string {
    let time: number
    if (value instanceof firestore.Timestamp) {
      time = value.toMillis()
    } else if (value instanceof Date) {
      time = value.getTime()
    } else {
      return '-'
    }
    const diff0 = new Date().getTime() - time
    const diff = Math.abs(diff0)
    const x = diff0 > 0 ? '前' : '後'
    const SEC = 1000
    const MIN = SEC * 60
    const HOUR = MIN * 60
    const DAY = HOUR * 24
    if (diff > DAY) {
      return Math.floor(diff / DAY) + '日' + x
    } else if (diff > HOUR) {
      return Math.floor(diff / HOUR) + '時間' + x
    } else if (diff > MIN) {
      return Math.floor(diff / (1000 * 60)) + '分' + x
    } else {
      return Math.floor(diff / SEC) + '秒' + x
    }
  }
}
