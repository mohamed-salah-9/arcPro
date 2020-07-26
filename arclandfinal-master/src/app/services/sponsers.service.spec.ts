import { TestBed } from '@angular/core/testing';

import { SponsersService } from './sponsers.service';

describe('SponsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SponsersService = TestBed.get(SponsersService);
    expect(service).toBeTruthy();
  });
});
