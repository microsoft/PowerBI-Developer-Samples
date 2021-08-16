import { TestBed } from '@angular/core/testing';

import { PowerBiApiService } from './power-bi-api.service';

describe('PowerBiApiService', () => {
  let service: PowerBiApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowerBiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
