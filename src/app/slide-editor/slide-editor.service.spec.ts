import { TestBed } from '@angular/core/testing'

import { SlideEditorService } from './slide-editor.service'

describe('SlideEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: SlideEditorService = TestBed.get(SlideEditorService)
    expect(service).toBeTruthy()
  })
})
