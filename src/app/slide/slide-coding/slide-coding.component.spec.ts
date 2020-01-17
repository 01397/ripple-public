import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SlideCodingComponent } from './slide-coding.component'

describe('SlideCodingComponent', () => {
  let component: SlideCodingComponent
  let fixture: ComponentFixture<SlideCodingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlideCodingComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideCodingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
