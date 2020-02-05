import { Component, OnInit, Input } from '@angular/core'
import { SlideElementType, SlideItem } from 'app/slide/slide-item'

@Component({
  selector: 'app-slide-editor-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss'],
})
export class SlideEditorElementComponent implements OnInit {
  public elementTypeList: [SlideElementType['type'], string][] = [
    ['paragraph', '段落'],
    ['image', '画像'],
    ['code', 'コード'],
    ['fillingCode', 'コード(穴埋め)'],
    ['quiz1', '4択'],
  ]
  @Input() public elements: SlideElementType[] = []

  constructor() {}

  ngOnInit() {}

  addElement(type: SlideElementType['type']) {
    const newEl = SlideItem.generateElement(type)
    this.elements.push(newEl)
  }

  // https://qiita.com/sassy_watson/items/9bd1cef78bfc110f0ba0
  myTrackBy(index: number, obj: any): any {
    return index
  }
}
