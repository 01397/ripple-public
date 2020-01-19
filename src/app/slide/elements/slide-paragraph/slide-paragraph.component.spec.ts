import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideParagraphComponent } from './slide-paragraph.component';

describe('SlideParagraphComponent', () => {
  let component: SlideParagraphComponent;
  let fixture: ComponentFixture<SlideParagraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideParagraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
