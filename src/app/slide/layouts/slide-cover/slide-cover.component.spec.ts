import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SlideCoverComponent } from './slide-cover.component'

describe('SlideCoverComponent', () => {
  let component: SlideCoverComponent
  let fixture: ComponentFixture<SlideCoverComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SlideCoverComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideCoverComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
