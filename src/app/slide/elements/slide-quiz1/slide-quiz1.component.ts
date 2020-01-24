import { Component, Input } from '@angular/core'
import { SlideAbstractComponent } from '../slide-abstract-element.component'
import { SlideService } from 'app/slide/slide.service'

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
  public options: string[]
  public order: number[]
  public selected: boolean[]

  constructor(private slideService: SlideService) {
    super()
  }

  ngOnInit() {
    const len = this.content.options.length
    this.order = this.shuffle(new Array(len).fill(null).map((v, i) => i))
    this.options = new Array(len).fill(null).map((v, i) => this.content.options[this.order[i]])
    this.selected = new Array(len).fill(false)
    this.slideService.lock()
    console.log(this)
  }

  shuffle(a: number[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  select(i: number) {
    const id = this.order[i]
    this.selected[i] = true
    if (id === this.content.answer) {
      this.slideService.unlock()
    }
  }
}
