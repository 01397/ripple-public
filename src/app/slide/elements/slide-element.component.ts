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

@Component({
  selector: 'app-slide-element',
  templateUrl: './slide-element.component.html',
  styleUrls: ['./slide-element.component.scss'],
})
export class SlideElementComponent implements OnInit {
  @Input() contents: { type: 'paragraph'; [key: string]: any }[]
  @ViewChild('body', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    for (const content of this.contents) {
      switch (content.type) {
        case 'paragraph':
          const factory = this.resolver.resolveComponentFactory(SlideParagraphComponent)
          this.viewContainerRef.createComponent(factory).instance.content = content.content
      }
    }
  }
}
