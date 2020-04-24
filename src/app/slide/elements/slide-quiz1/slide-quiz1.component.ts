import { Component, Input } from '@angular/core'
import { SlideService } from '../../slide.service'
import { SlideAbstractComponent } from '../slide-abstract-element.component'

export interface QuizElementType {
  type: 'quiz1'
  title: string
  answer: number
  options: string[]
  shuffle: boolean
}

@Component({
  selector: 'app-slide-quiz1',
  templateUrl: './slide-quiz1.component.html',
  styleUrls: ['./slide-quiz1.component.scss'],
})
export class SlideQuiz1Component extends SlideAbstractComponent {
  @Input() content: QuizElementType
  /**
   * 問題の並び順 order[表示順] = データid
   */
  public order: number[]
  /**
   * selected[データid] == 選択済?
   */
  public selected: boolean[]

  constructor(private slideService: SlideService) {
    super()
  }

  ngOnInit() {
    const len = this.content.options.length
    const order = new Array(len).fill(null).map((v, i) => i)
    this.order = this.content.shuffle ? this.shuffle(order) : order
    this.selected = new Array(len).fill(false)
    this.slideService.lock()
  }

  shuffle(a: number[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  select(i: number) {
    this.selected[i] = true
    if (i === this.content.answer) {
      this.slideService.unlock()
    }
  }

  static generateData(): QuizElementType {
    return {
      type: 'quiz1',
      answer: 0,
      options: ['', '', '', ''],
      shuffle: true,
      title: '',
    }
  }
}
