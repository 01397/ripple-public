import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactory,
  ComponentFactoryResolver,
  Input,
} from '@angular/core'
import { SlideParagraphComponent } from './slide-paragraph/slide-paragraph.component'
import { SlideElementType } from '../slide-item'
import { SlideImageComponent } from './slide-image/slide-image.component'
import { SlideCodeComponent } from './slide-code/slide-code.component'

type SlideContent =
  | { type: 'Paragraph'; content: any }
  | { type: 'Image'; src: string; alt: string; width?: string; height?: string }
  | { type: 'Code'; lang: string; code: string; }

@Component({
  selector: 'app-slide-element',
  templateUrl: './slide-element.component.html',
  styleUrls: ['./slide-element.component.scss'],
})
export class SlideElementComponent implements OnInit {
  @Input() contents: SlideContent[]
  @ViewChild('body', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    for (const content of this.contents) {
      switch (content.type) {
        case 'Paragraph':
          this.addParagraph(content)
          break
        case 'Image':
          this.addImage(content)
          break
        case 'Code':
          this.addCode(content)
          break
      }
    }
  }

  addParagraph(content: { content: any }) {
    const factory = this.resolver.resolveComponentFactory(SlideParagraphComponent)
    this.viewContainerRef.createComponent(factory).instance.content = content.content
  }

  addImage(content: { src: string; alt: string; width?: string; height?: string }) {
    const factory = this.resolver.resolveComponentFactory(SlideImageComponent)
    const instance = this.viewContainerRef.createComponent(factory).instance
    instance.src = content.src
    instance.alt = content.alt
  }

  addCode(content: { lang: string; code: string }) {
    const factory = this.resolver.resolveComponentFactory(SlideCodeComponent)
    const instance = this.viewContainerRef.createComponent(factory).instance
    instance.lang = content.lang
    instance.code = content.code
  }
}
