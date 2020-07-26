import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteVideosComponent } from './website-videos.component';

describe('WebsiteVideosComponent', () => {
  let component: WebsiteVideosComponent;
  let fixture: ComponentFixture<WebsiteVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
