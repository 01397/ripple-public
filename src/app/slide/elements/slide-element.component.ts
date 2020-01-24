import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactory,
  ComponentFactoryResolver,
  Input,
  Type,
} from '@angular/core'
import { SlideParagraphComponent } from './slide-paragraph/slide-paragraph.component'
import { SlideElementType } from '../slide-item'
import { SlideImageComponent } from './slide-image/slide-image.component'
import { SlideCodeComponent } from './slide-code/slide-code.component'
import { SlideQuiz1Component } from './slide-quiz1/slide-quiz1.component'
import { SlideAbstractComponent } from './slide-abstract-element.component'

export enum QuizType {
  selection,
  multiSelection,
}

@Component({
  selector: 'app-slide-element',
  templateUrl: './slide-element.component.html',
  styleUrls: ['./slide-element.component.scss'],
})
export class SlideElementComponent implements OnInit {
  @Input() contents: SlideElementType[]
  @ViewChild('body', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    const components: { [key in SlideElementType['type']]: Type<SlideAbstractComponent> } = {
      paragraph: SlideParagraphComponent,
      image: SlideImageComponent,
      code: SlideCodeComponent,
      quiz1: SlideQuiz1Component,
    }

    for (const content of this.contents) {
      const factory = this.resolver.resolveComponentFactory(components[content.type])
      const instance = this.viewContainerRef.createComponent(factory).instance
      instance.content = content
    }
  }
}
