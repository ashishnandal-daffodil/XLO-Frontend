import { TestBed } from '@angular/core/testing';

import { OpenAllCategoriesService } from './open-all-categories.service';

describe('OpenAllCategoriesService', () => {
  let service: OpenAllCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenAllCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
