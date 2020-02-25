import { Component, OnInit, Input } from '@angular/core'
import { SlideComponent } from '../slide.component'

export interface CoverSlideType {
  type: 'cover'
  course: string
  lesson: string
  organization: string
  author: string
}
@Component({
  selector: 'app-slide-cover',
  templateUrl: './slide-cover.component.html',
  styleUrls: ['./slide-cover.component.scss'],
})
export class SlideCoverComponent implements SlideComponent {
  @Input() data: CoverSlideType

  constructor() {}

  ngOnInit() {}

  static generateData(): CoverSlideType {
    return {
      type: 'cover',
      course: '',
      lesson: '',
      organization: '',
      author: '',
    }
  }
}
