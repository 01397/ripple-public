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
export interface LessonLogItem {
  user: string
  course: string
  lesson: string
  duration: null
  face: 0 | 1 | 2 | 3 | 4 | null
  done: boolean
  start: firestore.Timestamp | object
  end: firestore.Timestamp | object | null
  created: firestore.Timestamp | object
  modified: firestore.Timestamp | object
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
  created: firestore.Timestamp
  modified: firestore.Timestamp
}
