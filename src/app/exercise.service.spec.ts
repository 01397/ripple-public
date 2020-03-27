import { TestBed } from '@angular/core/testing'

import { ExerciseService } from './exercise.service'

describe('ExerciseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: ExerciseService = TestBed.inject(ExerciseService)
    expect(service).toBeTruthy()
  })
})
