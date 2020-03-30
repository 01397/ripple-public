import { Component, Input, OnDestroy } from '@angular/core'
import { SlideElementType, SlideItem } from '../../slide/slide-item'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { AngularFireStorage } from '@angular/fire/storage'
import { ImageElementType } from '../../slide/elements/slide-image/slide-image.component'
import { SlideService } from '../../slide/slide.service'
import { FillingCodeElementType } from '../../slide/elements/slide-filling-code/slide-filling-code.component'
import { SlideEditorService } from '../slide-editor.service'

@Component({
  selector: 'app-slide-editor-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss'],
})
export class SlideEditorElementComponent implements OnDestroy {
  public elementTypeList: { [key in SlideElementType['type']]: string } = {
    paragraph: '段落',
    image: '画像',
    code: 'コード',
    fillingCode: 'コード(穴埋め)',
    quiz1: '4択',
  }
  @Input() public elements: SlideElementType[] = []
  private tmpGb: { index: number; content: SlideElementType[] } = { index: 0, content: [] }

  constructor(
    private snackBar: MatSnackBar,
    private storage: AngularFireStorage,
    private slideService: SlideService,
    private editorServide: SlideEditorService
  ) {}

  ngOnDestroy() {
    this.snackBar.dismiss()
  }

  addElement(type: SlideElementType['type']) {
    const newEl = SlideItem.generateElement(type)
    this.elements.push(newEl)
    this.snackBar.dismiss()
    this.slideService.reflesh()
  }

  remove(index: number) {
    const target = this.elements[index]
    if (target.type === 'image') {
      this.removeImage(target.src)
    }
    this.tmpGb.index = index
    this.tmpGb.content = this.elements.splice(index, 1)
    this.openSnackBar('削除しました', '元に戻す')
    this.slideService.reflesh()
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
  /**
   * DnDによる順序変更
   */
  elementDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.elements, event.previousIndex, event.currentIndex)
  }
  upload(event: Event, el: ImageElementType) {
    const file = (event.target as HTMLInputElement).files[0]
    const filePath = 'slide/' + new Date().getTime()
    const ref = this.storage.ref(filePath)
    const snackConfig: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'right',
    }
    ref
      .put(file)
      .then(() => {
        this.snackBar.open('アップロードしました', null, snackConfig)
        const oldPath = el.src
        el.src = filePath
        this.slideService.updateSlide()
        this.removeImage(oldPath)
      })
      .catch((e) => {
        console.error(e)
        this.snackBar.open('アップロードに失敗しました', null, snackConfig)
      })
  }
  removeImage(path: string) {
    if (!path) {
      return
    }
    const oldRef = this.storage.ref(path)
    oldRef.delete().subscribe(() => {
      this.snackBar.open('以前の画像を削除しました', null, {
        duration: 3000,
        horizontalPosition: 'right',
      })
    })
  }

  getElementName() {}

  addBlank(el: FillingCodeElementType) {
    el.blanks.push({ size: 3, type: 'equalTo', values: [] })
  }
  removeBlank(el: FillingCodeElementType) {
    el.blanks.pop()
  }
}
