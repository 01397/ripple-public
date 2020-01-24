import { Component, Input } from '@angular/core'
import { SlideElementType } from '../../slide-item'
import { SlideComponent } from '../slide.component'

export interface TopicSlideType {
  type: 'topic'
  title: string
  left: SlideElementType[]
  right: SlideElementType[]
}

@Component({
  selector: 'app-slide-topic',
  templateUrl: './slide-topic.component.html',
  styleUrls: ['./slide-topic.component.scss'],
})
export class SlideTopicComponent implements SlideComponent {
  @Input() data: TopicSlideType

  constructor() {}

  ngOnInit() {}
}
