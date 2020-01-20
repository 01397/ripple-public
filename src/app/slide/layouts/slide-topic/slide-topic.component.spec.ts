import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideTopicComponent } from './slide-topic.component';

describe('SlideTopicComponent', () => {
  let component: SlideTopicComponent;
  let fixture: ComponentFixture<SlideTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
