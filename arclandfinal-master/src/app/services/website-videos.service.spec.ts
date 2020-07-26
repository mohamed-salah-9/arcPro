import { TestBed } from '@angular/core/testing';

import { WebsiteVideosService } from './website-videos.service';

describe('WebsiteVideosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebsiteVideosService = TestBed.get(WebsiteVideosService);
    expect(service).toBeTruthy();
  });
});
