import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SlideTwoColumnComponent } from './slide-two-column.component'

describe('SlideTwoColumnComponent', () => {
  let component: SlideTwoColumnComponent
  let fixture: ComponentFixture<SlideTwoColumnComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlideTwoColumnComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideTwoColumnComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
