import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentFactoryResolver,
  ElementRef,
  OnDestroy,
  HostListener,
} from '@angular/core'
import { SlideDirective } from '../slide/slide.directive'
import { SlideItem } from '../slide/slide-item'
import { SlideComponent } from '../slide/slide.component'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'

@Component({
  selector: 'app-slide-container',
  templateUrl: './slide-container.component.html',
  styleUrls: ['./slide-container.component.scss'],
})
export class SlideContainerComponent implements OnInit, OnDestroy {
  @Input() slide: SlideItem
  @ViewChild(SlideDirective, { static: true }) slideHost: SlideDirective
  private transform: string
  public safeTransform: SafeStyle
  private hostElement: HTMLElement
  interval: any

  constructor(
    private el: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sanitizer: DomSanitizer
  ) {
    this.hostElement = this.el.nativeElement
  }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.slide.component)
    const viewContainerRef = this.slideHost.viewContainerRef
    // viewContainerRef.clear()
    const componentRef = viewContainerRef.createComponent(componentFactory)
    ;(componentRef.instance as SlideComponent).data = this.slide.data
    this.adjustScale()
  }
  ngOnDestroy() {
    clearInterval(this.interval)
  }
  @HostListener('window:resize')
  adjustScale() {
    const clientWidth = this.hostElement.clientWidth
    const clientHeight = this.hostElement.clientHeight
    const scale = Math.min(clientWidth / 1280, clientHeight / 720)
    const dx = (clientWidth - 1280 * scale) / 2
    const dy = (clientHeight - 720 * scale) / 2
    this.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    this.safeTransform = this.sanitizer.bypassSecurityTrustStyle(this.transform)
  }
}
