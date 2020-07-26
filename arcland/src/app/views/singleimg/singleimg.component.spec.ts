import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleimgComponent } from './singleimg.component';

describe('SingleimgComponent', () => {
  let component: SingleimgComponent;
  let fixture: ComponentFixture<SingleimgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleimgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleimgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
