import { Component, OnInit } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { UserItem, AdminUserList } from '../../../firestore-item'
import { take } from 'rxjs/operators'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public inProcess: boolean = false
  public statusText: string = ''
  public adminList: Observable<AdminUserList>
  constructor(private db: AngularFirestore) {}

  ngOnInit(): void {
    this.adminList = this.db.doc<AdminUserList>('system/admin_users').valueChanges()
  }

  addAdmin(uid: string) {
    const userRef = this.db.doc<UserItem>('user/' + uid).ref
    const adminRef = this.db.doc('system/admin_users/').ref
    let name: string
    this.db.firestore
      .runTransaction((t) =>
        t.get(userRef).then((doc) => {
          name = (doc.data() as UserItem).name
          const data = { [`${uid}.name`]: name, [`${uid}.granted`]: false }
          t.update(adminRef, data)
        })
      )
      .then(async () => {
        const src = '/api/addAdminExec/' + uid
        const response = await fetch(src)
        const result = (await response.json()) as { success: boolean }
        if (result.success) {
          this.inProcess = false
          this.statusText = name + 'さんを管理者として追加しました'
        } else if (result.success) {
          this.inProcess = false
          this.statusText = '失敗'
        }
      })
  }
}
