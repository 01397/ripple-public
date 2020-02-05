import { Component, Input, OnDestroy } from '@angular/core'
import { SlideElementType, SlideItem } from 'app/slide/slide-item'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'app-slide-editor-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss'],
})
export class SlideEditorElementComponent implements OnDestroy {
  public elementTypeList: [SlideElementType['type'], string][] = [
    ['paragraph', '段落'],
    ['image', '画像'],
    ['code', 'コード'],
    ['fillingCode', 'コード(穴埋め)'],
    ['quiz1', '4択'],
  ]
  @Input() public elements: SlideElementType[] = []
  private tmpGb: { index: number; content: SlideElementType[] } = { index: 0, content: [] }

  constructor(private snackBar: MatSnackBar) {}

  ngOnDestroy() {
    this.snackBar.dismiss()
  }

  addElement(type: SlideElementType['type']) {
    const newEl = SlideItem.generateElement(type)
    this.elements.push(newEl)
    this.snackBar.dismiss()
  }

  remove(index: number) {
    this.tmpGb.index = index
    this.tmpGb.content = this.elements.splice(index, 1)
    this.openSnackBar('削除しました', '元に戻す')
  }

  undo() {
    this.elements.splice(this.tmpGb.index, 0, ...this.tmpGb.content)
  }

  openSnackBar(message: string, action: string) {
    this.snackBar
      .open(message, action, {
        duration: 10000,
        horizontalPosition: 'right',
      })
      .onAction()
      .subscribe(() => {
        this.undo()
      })
  }

  // https://qiita.com/sassy_watson/items/9bd1cef78bfc110f0ba0
  myTrackBy(index: number, obj: any): any {
    return index
  }
}
