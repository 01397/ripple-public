import { Type } from '@angular/core'
import { CodeElementType, SlideCodeComponent } from './elements/slide-code/slide-code.component'
import {
  FillingCodeElementType,
  SlideFillingCodeComponent,
} from './elements/slide-filling-code/slide-filling-code.component'
import { ImageElementType, SlideImageComponent } from './elements/slide-image/slide-image.component'
import { ParagraphElementType, SlideParagraphComponent } from './elements/slide-paragraph/slide-paragraph.component'
import { QuizElementType, SlideQuiz1Component } from './elements/slide-quiz1/slide-quiz1.component'
import { CoverSlideType, SlideCoverComponent } from './layouts/slide-cover/slide-cover.component'
import { OneColumnSlideType, SlideOneColumnComponent } from './layouts/slide-one-column/slide-one-column.component'
import { SlideTopicComponent, TopicSlideType } from './layouts/slide-topic/slide-topic.component'
import { SlideTwoColumnComponent, TwoColumnSlideType } from './layouts/slide-two-column/slide-two-column.component'
import { SlideComponent } from './layouts/slide.component'

export interface SlideData {
  title: string
  slide: SlideType
  speech: {
    path: string | null
    text: string
  }
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
  static generateSlide(type: SlideType['type']): SlideType {
    switch (type) {
      case 'cover':
        return SlideCoverComponent.generateData()
      case 'oneColumn':
        return SlideOneColumnComponent.generateData()
      case 'twoColumn':
        return SlideTwoColumnComponent.generateData()
      case 'topic':
        return SlideTopicComponent.generateData()
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
