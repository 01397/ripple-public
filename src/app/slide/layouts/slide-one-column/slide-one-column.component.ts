import { Component, Input } from '@angular/core'
import { SlideComponent } from '../slide.component'
import { SlideData, SlideElementType } from 'app/slide/slide-item'

export interface OneColumnSlideType {
  type: 'oneColumn'
  title: string
  body: SlideElementType[]
}

@Component({
  selector: 'app-slide-one-column',
  templateUrl: './slide-one-column.component.html',
  styleUrls: ['./slide-one-column.component.scss'],
})
export class SlideOneColumnComponent implements SlideComponent {
  @Input() data: OneColumnSlideType

  constructor() {}

  ngOnInit() {}
}
