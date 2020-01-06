import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  public courses = [
    { courseId: 'python-1st', title: 'Python 1st step', date: '7日前', progress: '0.8' },
    { courseId: 'python-2nd', title: 'Python 2nd step', date: '9日前', progress: '0.6' },
  ]
  public selectedCourses = {
    courseId: 'python-1st',
    title: 'Python 1st step',
    description:
      'Pythonという言語を用いて、プログラミングの最初の一歩から学びます。ここに説明を書きます。ここに説明を書きます。ここに説明を書きます。ここに説明を書きます。',
    progress: '0.8',
    sections: [
      {
        title: '初めてのPython',
        lessons: [
          { title: 'Pythonとは', studyCount: 1, lastStudiedAt: '3日前', done: true },
          { title: 'Pythonとは', studyCount: 1, lastStudiedAt: '3日前', done: true },
          { title: 'Pythonとは', studyCount: 1, lastStudiedAt: '3日前', done: true },
        ],
      },
      {
        title: '初めてのPython',
        lessons: [
          { title: 'Pythonとは', studyCount: 1, lastStudiedAt: '3日前', done: true },
          { title: 'Pythonとは', studyCount: 1, lastStudiedAt: '3日前', done: true },
          { title: 'Pythonとは', studyCount: 1, lastStudiedAt: '3日前', done: true },
        ],
      },
    ],
  }

  constructor() {}

  ngOnInit() {}
}
