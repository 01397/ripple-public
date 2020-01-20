import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-slide-topic',
  templateUrl: './slide-topic.component.html',
  styleUrls: ['./slide-topic.component.scss'],
})
export class SlideTopicComponent implements OnInit {
  @Input() data: { title: string; left: any; right: any }

  constructor() {}

  ngOnInit() {}
}
