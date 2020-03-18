import { AngularFirestoreCollection } from '@angular/fire/firestore'
import { firestore } from 'firebase'
import { SlideData } from 'app/slide/slide-item'

export interface CourseItem {
  title: string
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
}
