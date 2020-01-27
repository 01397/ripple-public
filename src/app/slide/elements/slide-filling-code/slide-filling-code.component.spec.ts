import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideFillingCodeComponent } from './slide-filling-code.component';

describe('SlideFillingCodeComponent', () => {
  let component: SlideFillingCodeComponent;
  let fixture: ComponentFixture<SlideFillingCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideFillingCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideFillingCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
