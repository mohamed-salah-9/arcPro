import { TestBed } from '@angular/core/testing';

import { WebsiteDetailsService } from './website-details.service';

describe('WebsiteDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebsiteDetailsService = TestBed.get(WebsiteDetailsService);
    expect(service).toBeTruthy();
  });
});
