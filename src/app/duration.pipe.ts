import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(ms: number): string {
    const sec = Math.floor(ms / 1000)
    const min = Math.floor(sec / 60)
    const secStr = (sec % 60).toString().padStart(2, '0')
    const minStr = min.toString().padStart(2, '0')
    return `${minStr}分${secStr}秒`
  }
}
