import { TestBed } from '@angular/core/testing';

import { NotificationDialogService } from './notification-dialog.service';

describe('NotificationDialogService', () => {
  let service: NotificationDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
