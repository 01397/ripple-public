import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-slide-paragraph',
  templateUrl: './slide-paragraph.component.html',
  styleUrls: ['./slide-paragraph.component.scss'],
})
export class SlideParagraphComponent implements OnInit {
  @Input() content: string

  constructor() {}

  ngOnInit() {}
}
