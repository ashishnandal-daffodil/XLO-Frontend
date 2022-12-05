import { ElementRef, Injectable } from "@angular/core";
import { MatDialog, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { NotificationDialogComponent } from "src/app/notification-dialog/notification-dialog.component";
import { Router } from "@angular/router";
import { LocalStorageService } from "../localStorage/local.service";

@Injectable({
  providedIn: "root"
})
export class NotificationDialogService {
  dialogRef: MatDialogRef<any>;
  matDialogConfig: MatDialogConfig = new MatDialogConfig();
  constructor(public dialog: MatDialog, public router: Router, private localStorageService: LocalStorageService) {}

  public openNotificationDialog(): MatDialogRef<NotificationDialogComponent> {
    this.matDialogConfig.hasBackdrop = true;
    this.matDialogConfig.backdropClass = "cdk-overlay-transparent-backdrop";
    this.dialogRef = this.dialog.open(NotificationDialogComponent, this.matDialogConfig);
    return this.dialogRef;
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
