import { TestBed } from '@angular/core/testing'

import { RegisteredGuard } from './registered.guard'

describe('RegisteredGuard', () => {
  let guard: RegisteredGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(RegisteredGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
