import { Input, OnInit } from '@angular/core'

export abstract class SlideAbstractComponent implements OnInit {
  @Input() content: any

  ngOnInit() {}
}
