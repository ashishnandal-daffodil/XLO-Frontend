import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCatgeoriesDialogComponent } from './all-categories-dialog.component';

describe('AllCatgeoriesDialogComponent', () => {
  let component: AllCatgeoriesDialogComponent;
  let fixture: ComponentFixture<AllCatgeoriesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCatgeoriesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCatgeoriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
