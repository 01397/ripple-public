import { TestBed } from '@angular/core/testing'

import { InMemoryDbService } from 'angular-in-memory-web-api'

describe('InMemorywApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: InMemoryDbService = TestBed.inject(InMemoryDbService)
    expect(service).toBeTruthy()
  })
})
