import { Component, Input } from '@angular/core'
import { SlideAbstractComponent } from '../slide-abstract-element.component'
import { AngularFireStorage } from '@angular/fire/storage'
import { take } from 'rxjs/operators'

export interface ImageElementType {
  type: 'image'
  src: string
  alt?: string
  width?: number
  height?: number
}

@Component({
  selector: 'app-slide-image',
  templateUrl: './slide-image.component.html',
  styleUrls: ['./slide-image.component.scss'],
})
export class SlideImageComponent extends SlideAbstractComponent {
  @Input() content: ImageElementType
  loaded: boolean = false
  src: string // = 'assets/images/loading.png'
  constructor(private strage: AngularFireStorage) {
    super()
  }
  ngOnInit() {
    this.strage
      .ref(this.content.src)
      .getDownloadURL()
      .pipe(take(1))
      .subscribe((path) => {
        this.loaded = true
        this.src = path
      })
  }
  static generateData(): ImageElementType {
    return {
      type: 'image',
      src: '',
    }
  }
}
