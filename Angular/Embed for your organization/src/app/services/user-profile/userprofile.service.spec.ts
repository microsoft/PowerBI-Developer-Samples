import { TestBed } from '@angular/core/testing';

import { UserprofileService } from './userprofile.service';

describe('UserprofileService', () => {
  let service: UserprofileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserprofileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
