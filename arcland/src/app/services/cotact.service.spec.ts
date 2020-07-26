import { TestBed } from '@angular/core/testing';

import { CotactService } from './cotact.service';

describe('CotactService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CotactService = TestBed.get(CotactService);
    expect(service).toBeTruthy();
  });
});
