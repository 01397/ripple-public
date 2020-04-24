import { Component, Input } from '@angular/core'
import { SlideElementType } from '../../slide-item'
import { SlideComponent } from '../slide.component'

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
