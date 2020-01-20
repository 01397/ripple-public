import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-slide-image',
  templateUrl: './slide-image.component.html',
  styleUrls: ['./slide-image.component.scss'],
})
export class SlideImageComponent implements OnInit {
  @Input() src: string
  @Input() alt: string
  @Input() width: string = ''
  @Input() height: string = ''

  constructor() {}

  ngOnInit() {}
}
