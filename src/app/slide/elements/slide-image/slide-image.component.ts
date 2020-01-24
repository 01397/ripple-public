import { Component, Input } from '@angular/core'
import { SlideAbstractComponent } from '../slide-abstract-element.component'

export interface ImageElementType {
  type: 'image'
  src: string
  alt?: string
  width?: string
  height?: string
}

@Component({
  selector: 'app-slide-image',
  templateUrl: './slide-image.component.html',
  styleUrls: ['./slide-image.component.scss'],
})
export class SlideImageComponent extends SlideAbstractComponent {
  @Input() content: ImageElementType

  ngOnInit() {}
}
