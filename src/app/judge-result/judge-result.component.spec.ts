import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeResultComponent } from './judge-result.component';

describe('JudgeResultComponent', () => {
  let component: JudgeResultComponent;
  let fixture: ComponentFixture<JudgeResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
