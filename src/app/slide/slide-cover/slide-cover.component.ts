import { Component, OnInit, Input } from '@angular/core'
import { SlideComponent } from '../slide/slide.component'

@Component({
  selector: 'app-slide-cover',
  templateUrl: './slide-cover.component.html',
  styleUrls: ['./slide-cover.component.scss'],
})
export class SlideCoverComponent implements SlideComponent {
  @Input() data: { course: string; lesson: string; organization: string; author: string }

  constructor() {}

  ngOnInit() {}
}
