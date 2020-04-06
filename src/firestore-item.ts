import { AngularFirestoreCollection } from '@angular/fire/firestore'
import { firestore } from 'firebase/app'
import { SlideData } from './app/slide/slide-item'

export interface CourseItem {
  title: string
  total: number
  description: string
  private: boolean
  lesson?: AngularFirestoreCollection
  created: firestore.Timestamp
  modified: firestore.Timestamp
}
export interface CourseItemId extends CourseItem {
  id: string
}
export interface LessonItem {
  title: string
  description: string
  private: boolean
  slide: { data: SlideData[] }
  exercise?: AngularFirestoreCollection
  created: firestore.Timestamp
  modified: firestore.Timestamp
}
export interface LessonItemId extends LessonItem {
  id: string
  courseId: string
}
export interface UserItem {
  name: string
  gender: number
  age: number
  job: number
  purpose: number
  region: any
  trigger: number
  interest: number[]
  experience: number
  lastLesson: {
    course: string
    lesson: string
  } | null
  modified: firestore.Timestamp | firestore.FieldValue
}
export interface LessonLogItem {
  user: string
  course: string
  lesson: string
  duration: number
  face: 0 | 1 | 2 | 3 | 4 | null
  done: boolean
  start: firestore.Timestamp | firestore.FieldValue
  end: firestore.Timestamp | firestore.FieldValue | null
  created: firestore.Timestamp | firestore.FieldValue
  modified: firestore.Timestamp | firestore.FieldValue
}
export interface ExerciseLogItem {
  user: string
  course: string
  lesson: string
  exercise: string
  source_code: string
  pass: boolean
  stdout_1?: string
  stderr_1?: string
  stdout_2?: string
  stderr_2?: string
  stdout_3?: string
  stderr_3?: string
  // created: firestore.Timestamp | firestore.FieldValue
  modified: firestore.Timestamp | firestore.FieldValue
}
export interface LessonRecordItem {
  user: string
  course: string
  lesson: string
  last: firestore.Timestamp | firestore.FieldValue
  count: number | firestore.FieldValue
  face: 0 | 1 | 2 | 3 | 4 | null
  // created: firestore.Timestamp | firestore.FieldValue
  modified: firestore.Timestamp | firestore.FieldValue
}
export interface NotificationItem {
  title: string
  body: string
  type: 'info'
  private: boolean
  modified: firestore.Timestamp | firestore.FieldValue
  created: firestore.Timestamp | firestore.FieldValue
}
export interface NotificationItemId extends NotificationItem {
  id: string
}
export interface PickupItem {
  title: string
  body: string
  action: { label: string; navigate: string; external: boolean } | null
  private: boolean
}

export interface AdminUser {
  granted: boolean
  created: firestore.Timestamp | firestore.FieldValue
}
