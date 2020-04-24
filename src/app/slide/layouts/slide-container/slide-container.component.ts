import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { SlideData, SlideItem } from '../../slide-item'
import { SlideService } from '../../slide.service'
import { SlideComponent } from '../slide.component'
import { SlideDirective } from './slide.directive'

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
  public subtitles = '字幕テスト。今回扱う内容はあれやこれですが、どういうわけかそうなんですよ。'
  private SUBTITLE_HEIGHT = 80
  private destroy: Subject<void> = new Subject()

  constructor(
    private el: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sanitizer: DomSanitizer,
    public slideService: SlideService
  ) {
    this.hostElement = this.el.nativeElement
  }

  ngOnInit() {
    this.adjustScale()
    this.slideService.slideSubject.pipe(takeUntil(this.destroy)).subscribe((slide) => this.setSlide(slide))
    this.slideService.subtitlesSubject.pipe(takeUntil(this.destroy)).subscribe((subtitle) => {
      // const text = subtitle.replace(/\[(.+?)\|(.+?)\]/g, '<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp>')
      const text = subtitle.replace(/\[(.+?)\|(.+?)\]/gm, '$1').replace(/<.+?s>/g, '')
      this.subtitles = text
      this.adjustScale()
    })
  }
  ngOnDestroy() {
    this.destroy.next()
    this.slideService.stopAudio()
    clearInterval(this.interval)
  }

  setSlide(slide: SlideData) {
    console.log(slide)
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
    let clientHeight = this.hostElement.clientHeight
    if (this.slideService.subtitleEnabled) {
      clientHeight -= this.SUBTITLE_HEIGHT
    }
    const scale = Math.min(clientWidth / 1280, clientHeight / 720)
    const dx = (clientWidth - 1280 * scale) / 2
    const dy = (clientHeight - 720 * scale) / 2
    this.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    this.safeTransform = this.sanitizer.bypassSecurityTrustStyle(this.transform)
  }
}
