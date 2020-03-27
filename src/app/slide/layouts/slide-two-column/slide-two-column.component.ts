import { Component, OnInit, Input } from '@angular/core'
import { SlideComponent } from '../slide.component'
import { SlideElementType } from '../../../slide/slide-item'

export interface TwoColumnSlideType {
  type: 'twoColumn'
  title: string
  left: SlideElementType[]
  right: SlideElementType[]
}

@Component({
  selector: 'app-slide-two-column',
  templateUrl: './slide-two-column.component.html',
  styleUrls: ['./slide-two-column.component.scss'],
})
export class SlideTwoColumnComponent implements SlideComponent {
  @Input() data: TwoColumnSlideType

  constructor() {}

  ngOnInit() {}

  static generateData(): TwoColumnSlideType {
    return {
      type: 'twoColumn',
      title: '',
      left: [],
      right: [],
    }
  }
}
