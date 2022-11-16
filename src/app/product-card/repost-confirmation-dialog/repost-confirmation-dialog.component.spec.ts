import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepostConfirmationDialogComponent } from './repost-confirmation-dialog.component';

describe('RepostConfirmationDialogComponent', () => {
  let component: RepostConfirmationDialogComponent;
  let fixture: ComponentFixture<RepostConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepostConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepostConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
