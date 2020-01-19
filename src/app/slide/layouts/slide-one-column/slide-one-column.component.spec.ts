import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SlideOneColumnComponent } from './slide-one-column.component'

describe('SlideOneColumnComponent', () => {
  let component: SlideOneColumnComponent
  let fixture: ComponentFixture<SlideOneColumnComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlideOneColumnComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideOneColumnComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
