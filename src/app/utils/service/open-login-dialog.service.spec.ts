import { TestBed } from '@angular/core/testing';

import { OpenLoginDialogService } from './open-login-dialog.service';

describe('OpenLoginDialogService', () => {
  let service: OpenLoginDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenLoginDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
