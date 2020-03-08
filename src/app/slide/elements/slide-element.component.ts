import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input, Type } from '@angular/core'
import { SlideParagraphComponent } from './slide-paragraph/slide-paragraph.component'
import { SlideElementType } from '../slide-item'
import { SlideImageComponent } from './slide-image/slide-image.component'
import { SlideCodeComponent } from './slide-code/slide-code.component'
import { SlideQuiz1Component } from './slide-quiz1/slide-quiz1.component'
import { SlideAbstractComponent } from './slide-abstract-element.component'
import { SlideFillingCodeComponent } from './slide-filling-code/slide-filling-code.component'

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
  private _contents: SlideElementType[]
  @Input() set contents(value: SlideElementType[]) {
    this._contents = value
    this.update()
  }
  @ViewChild('body', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.update()
  }
  update() {
    const components: { [key in SlideElementType['type']]: Type<SlideAbstractComponent> } = {
      paragraph: SlideParagraphComponent,
      image: SlideImageComponent,
      code: SlideCodeComponent,
      quiz1: SlideQuiz1Component,
      fillingCode: SlideFillingCodeComponent,
    }
    this.viewContainerRef.clear()
    for (const content of this._contents) {
      const factory = this.resolver.resolveComponentFactory(components[content.type])
      const instance = this.viewContainerRef.createComponent(factory).instance
      instance.content = content
    }
  }
}
