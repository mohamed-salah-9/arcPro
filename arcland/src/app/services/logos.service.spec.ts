import { TestBed } from '@angular/core/testing';

import { LogosService } from './logos.service';

describe('LogosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogosService = TestBed.get(LogosService);
    expect(service).toBeTruthy();
  });
});
