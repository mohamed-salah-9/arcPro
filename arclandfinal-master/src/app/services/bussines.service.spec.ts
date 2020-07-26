import { TestBed } from '@angular/core/testing';

import { BussinesService } from './bussines.service';

describe('BussinesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BussinesService = TestBed.get(BussinesService);
    expect(service).toBeTruthy();
  });
});
