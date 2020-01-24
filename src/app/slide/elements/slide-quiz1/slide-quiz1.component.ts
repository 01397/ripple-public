import { Component, Input } from '@angular/core'
import { SlideAbstractComponent } from '../slide-abstract-element.component'

export interface QuizElementType {
  type: 'quiz1'
  title: string
}

@Component({
  selector: 'app-slide-quiz1',
  templateUrl: './slide-quiz1.component.html',
  styleUrls: ['./slide-quiz1.component.scss'],
})
export class SlideQuiz1Component extends SlideAbstractComponent {
  @Input() content: QuizElementType

  ngOnInit() {}
}
