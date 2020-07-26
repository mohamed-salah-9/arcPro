import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteImagesComponent } from './website-images.component';

describe('WebsiteImagesComponent', () => {
  let component: WebsiteImagesComponent;
  let fixture: ComponentFixture<WebsiteImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
