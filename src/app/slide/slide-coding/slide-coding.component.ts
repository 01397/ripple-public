import { Component, OnInit, Input } from '@angular/core'
import { SlideComponent } from '../slide/slide.component'

@Component({
  selector: 'app-slide-coding',
  templateUrl: './slide-coding.component.html',
  styleUrls: ['./slide-coding.component.scss'],
})
export class SlideCodingComponent implements SlideComponent {
  @Input() data: any
  options = { maxLines: 1000, printMargin: false }

  constructor() {}

  ngOnInit() {}
}
