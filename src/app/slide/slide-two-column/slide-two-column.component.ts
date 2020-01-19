import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-slide-two-column',
  templateUrl: './slide-two-column.component.html',
  styleUrls: ['./slide-two-column.component.scss'],
})
export class SlideTwoColumnComponent implements OnInit {
  @Input() data: { title: string; left: any; right: any }

  constructor() {}

  ngOnInit() {}
}
