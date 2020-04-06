import { Component, OnInit } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AdminUser } from '../../../firestore-item'
import { firestore } from 'firebase'
import { environment } from 'environments/environment'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public inProcess: boolean = false
  public statusText: string = ''
  constructor(private db: AngularFirestore) {}

  ngOnInit(): void {}

  addAdmin(uid: string) {
    this.db
      .doc<AdminUser>('admin-list/' + uid)
      .set({
        granted: false,
        created: firestore.FieldValue.serverTimestamp(),
      })
      .then(async () => {
        const src = (environment.production ? '' : 'localhost:3000') + '/api/addAdminExec'
        const response = await fetch(src)
        const result = (await response.json()) as { success: boolean }
        if (result.success) {
          this.inProcess = false
          this.statusText = '追加完了'
        } else if (result.success) {
          this.inProcess = false
          this.statusText = '追加に失敗'
        }
      })
  }
}
