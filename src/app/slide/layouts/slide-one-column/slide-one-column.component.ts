import { Component, Input } from '@angular/core'
import { SlideComponent } from '../slide.component'

@Component({
  selector: 'app-slide-one-column',
  templateUrl: './slide-one-column.component.html',
  styleUrls: ['./slide-one-column.component.scss'],
})
export class SlideOneColumnComponent implements SlideComponent {
  @Input() data: { title: string; body: any }

  constructor() {}

  ngOnInit() {}
}
