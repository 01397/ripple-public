import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'fromNow',
})
export class FromNowPipe implements PipeTransform {
  transform(value: Date): string {
    if (value === null) {
      return '-'
    }
    const diff = new Date().getTime() - value.getTime()
    if (diff < 1000 * 60) {
      return Math.floor(diff / 1000) + '秒前'
    } else if (diff < 1000 * 60 * 60) {
      return Math.floor(diff / (1000 * 60 * 60)) + '分前'
    } else if (diff < 1000 * 60 * 60 * 24) {
      return Math.floor(diff / (1000 * 60 * 60)) + '時間前'
    }
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + '日前'
  }
}
