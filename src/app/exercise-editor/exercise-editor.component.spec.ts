import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ExerciseEditorComponent } from './exercise-editor.component'

describe('ExerciseEditorComponent', () => {
  let component: ExerciseEditorComponent
  let fixture: ComponentFixture<ExerciseEditorComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciseEditorComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
