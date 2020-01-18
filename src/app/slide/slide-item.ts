import { Type } from '@angular/core'
import { SlideCodingComponent } from './layouts/slide-coding/slide-coding.component'
import { SlideCoverComponent } from './layouts/slide-cover/slide-cover.component'

export type SlideType = 'Cover' | 'OneColumn'

export class SlideItem {
  constructor(public component: Type<any>, public data: any) {}
  static getComponent(type: SlideType) {
    switch (type) {
      case 'Cover':
        return SlideCoverComponent
    }
  }
}

export class CoverSlideItem extends SlideItem {
  constructor(public data: { author: string; organization: string; course: string; lesson: string }) {
    super(SlideCodingComponent, data)
  }
}
export class OneColumnSlideItem extends SlideItem {
  constructor(public data: { author: string; organization: string; course: string; lesson: string }) {
    super(SlideCodingComponent, data)
  }
}

export interface SlideData {
  title: string
  type: SlideType
  data: any
}
