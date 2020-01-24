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
import { SlideDirective } from './slide.directive'
import { SlideItem, SlideData } from '../../slide-item'
import { SlideComponent } from '../slide.component'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { SlideService } from '../../slide.service'

@Component({
  selector: 'app-slide-container',
  templateUrl: './slide-container.component.html',
  styleUrls: ['./slide-container.component.scss'],
})
export class SlideContainerComponent implements OnInit, OnDestroy {
  @ViewChild(SlideDirective, { static: true }) slideHost: SlideDirective
  private transform: string
  public safeTransform: SafeStyle
  private hostElement: HTMLElement
  interval: any

  constructor(
    private el: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sanitizer: DomSanitizer,
    private slideService: SlideService
  ) {
    this.hostElement = this.el.nativeElement
  }

  ngOnInit() {
    this.adjustScale()
    this.slideService.slideSubject.subscribe(slide => this.setSlide(slide))
  }
  ngOnDestroy() {
    clearInterval(this.interval)
  }

  setSlide(slide: SlideData) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      SlideItem.getComponent(slide.slide.type)
    )
    const viewContainerRef = this.slideHost.viewContainerRef
    viewContainerRef.clear()
    const componentRef = viewContainerRef.createComponent(componentFactory)
    ;(componentRef.instance as SlideComponent).data = slide.slide
  }

  /**
   * 画面サイズに応じて表示倍率を変更
   */
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
