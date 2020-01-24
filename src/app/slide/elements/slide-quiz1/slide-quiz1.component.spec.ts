import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SlideQuiz1Component } from './slide-quiz1.component'

describe('SlideQuiz1Component', () => {
  let component: SlideQuiz1Component
  let fixture: ComponentFixture<SlideQuiz1Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlideQuiz1Component],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideQuiz1Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
