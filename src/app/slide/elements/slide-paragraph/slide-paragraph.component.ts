import { Component, Input } from '@angular/core'
import { SlideAbstractComponent } from '../slide-abstract-element.component'

export interface ParagraphElementType {
  type: 'paragraph'
  body: string
}
@Component({
  selector: 'app-slide-paragraph',
  templateUrl: './slide-paragraph.component.html',
  styleUrls: ['./slide-paragraph.component.scss'],
})
export class SlideParagraphComponent implements SlideAbstractComponent {
  @Input() content: ParagraphElementType

  ngOnInit() {}

  static generateData(): ParagraphElementType {
    return {
      type: 'paragraph',
      body: '',
    }
  }
}
