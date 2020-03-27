import { TestBed } from '@angular/core/testing'

import { SlideService } from './slide.service'

describe('SlideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: SlideService = TestBed.inject(SlideService)
    expect(service).toBeTruthy()
  })
})
