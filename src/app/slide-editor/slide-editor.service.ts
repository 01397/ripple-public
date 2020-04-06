import { Injectable } from '@angular/core'
import { AngularFireStorage } from '@angular/fire/storage'
import { v4 as uuidv4 } from 'uuid'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SlideEditorService {
  constructor(private storage: AngularFireStorage) {}

  public async updateTTS(value: string, oldPath?: string) {
    const ssml =
      '<speak>' +
      value.replace(/<(.+?s)>/g, '<break time="$1"/>').replace(/\[(.+?)\|(.+?)\]/g, '<sub alias="$2">$1</sub>') +
      '</speak>'

    const src = (environment.production ? '' : 'https://ripple-public.appspot.com') + '/api/tts?ssml=' + ssml
    const response = await fetch(src)
    const blob = await response.blob()
    const filePath = 'slide-tts/' + uuidv4()
    const ref = this.storage.ref(filePath)
    await ref.put(blob)
    await this.removeTTS(oldPath)
    return filePath
  }
  async removeTTS(path: string) {
    if (!path) {
      return
    }
    const oldRef = this.storage.ref(path)
    oldRef.delete().toPromise()
  }
}
