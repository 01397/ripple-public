import { Component, OnInit, OnDestroy } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { NotificationItem, NotificationItemId } from '../../firestore-item'
import { AngularFirestore } from '@angular/fire/firestore'
import { map } from 'rxjs/operators'
import { firestore } from 'firebase'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notificationObservable: Observable<NotificationItemId[]>
  private subscription = new Set<Subscription>()
  public notifications: NotificationItemId[]
  public active: NotificationItemId | null = null
  public visible = false
  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    this.notificationObservable = this.db
      .collection<NotificationItem>('notification', (ref) => ref.where('private', '==', false))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data()
            const id = a.payload.doc.id
            return { id, ...data }
          })
        )
      )
    this.subscription.add(
      this.notificationObservable.subscribe((notifications) => {
        this.notifications = notifications
        console.log(notifications)
      })
    )
  }
  selectNotification(notification: NotificationItemId) {
    this.active = notification
    this.visible = true
  }
  hide() {
    this.visible = false
  }
  getCreated(item: NotificationItemId) {
    const date = item.created
    if (date instanceof firestore.Timestamp) {
      return date.toDate()
    }
    return null
  }
  getModified(item: NotificationItemId) {
    const date = item.modified
    if (date instanceof firestore.Timestamp) {
      return date.toDate()
    }
    return null
  }
  ngOnDestroy() {
    for (const sub of this.subscription) {
      sub.unsubscribe()
    }
  }
}
