import { ElementRef, Injectable } from "@angular/core";
import { MatDialog, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { UserProfileDialogComponent } from "src/app/user-profile-dialog/user-profile-dialog.component";
import { Router } from "@angular/router";
import { LocalStorageService } from "../localStorage/local.service";

@Injectable({
  providedIn: "root"
})
export class UserProfileService {
  dialogRef: MatDialogRef<any>;
  constructor(public dialog: MatDialog, public router: Router, private localStorageService: LocalStorageService) {}

  public openUserProfileDialog(): MatDialogRef<UserProfileDialogComponent> {
    let matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.hasBackdrop = false;
    this.dialogRef = this.dialog.open(UserProfileDialogComponent, matDialogConfig);
    return this.dialogRef;
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
