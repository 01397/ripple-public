import { Type } from '@angular/core'
import { SlideCodingComponent } from './layouts/slide-coding/slide-coding.component'
import { SlideCoverComponent, CoverSlideType } from './layouts/slide-cover/slide-cover.component'
import { SlideOneColumnComponent, OneColumnSlideType } from './layouts/slide-one-column/slide-one-column.component'
import { SlideComponent } from './layouts/slide.component'
import { SlideTwoColumnComponent, TwoColumnSlideType } from './layouts/slide-two-column/slide-two-column.component'
import { SlideTopicComponent, TopicSlideType } from './layouts/slide-topic/slide-topic.component'
import { CodeElementType, SlideCodeComponent } from './elements/slide-code/slide-code.component'
import { ParagraphElementType, SlideParagraphComponent } from './elements/slide-paragraph/slide-paragraph.component'
import { ImageElementType, SlideImageComponent } from './elements/slide-image/slide-image.component'
import { QuizElementType, SlideQuiz1Component } from './elements/slide-quiz1/slide-quiz1.component'
import {
  FillingCodeElementType,
  SlideFillingCodeComponent,
} from './elements/slide-filling-code/slide-filling-code.component'

export interface SlideData {
  title: string
  slide: SlideType
}
export type SlideType = CoverSlideType | TopicSlideType | OneColumnSlideType | TwoColumnSlideType
export type SlideElementType =
  | ParagraphElementType
  | ImageElementType
  | CodeElementType
  | QuizElementType
  | FillingCodeElementType

export class SlideItem {
  constructor(public component: Type<any>, public data: any) {}

  static getComponent(type: SlideType['type']): Type<SlideComponent> {
    switch (type) {
      case 'cover':
        return SlideCoverComponent
      case 'oneColumn':
        return SlideOneColumnComponent
      case 'twoColumn':
        return SlideTwoColumnComponent
      case 'topic':
        return SlideTopicComponent
    }
  }
  static generateElement(type: SlideElementType['type']): SlideElementType {
    switch (type) {
      case 'code':
        return SlideCodeComponent.generateData()
      case 'fillingCode':
        return SlideFillingCodeComponent.generateData()
      case 'image':
        return SlideImageComponent.generateData()
      case 'paragraph':
        return SlideParagraphComponent.generateData()
      case 'quiz1':
        return SlideQuiz1Component.generateData()
    }
  }
}
