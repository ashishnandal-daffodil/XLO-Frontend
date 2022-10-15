import { ElementRef, Injectable } from "@angular/core";
import { MatDialog, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { AllCatgeoriesDialogComponent } from "src/app/category-header/all-categories-dialog/all-categories-dialog.component";
import { Router } from "@angular/router";
import { LocalStorageService } from "../localStorage/local.service";

@Injectable({
  providedIn: "root"
})
export class OpenAllCategoriesService {
  dialogRef: MatDialogRef<any>;

  constructor(public dialog: MatDialog, public router: Router, private localStorageService: LocalStorageService) {}

  public openAllCategories(): MatDialogRef<AllCatgeoriesDialogComponent> {
    let matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.width = "84vw";
    matDialogConfig.maxWidth = "84vw";
    matDialogConfig.hasBackdrop = false;
    this.dialogRef = this.dialog.open(AllCatgeoriesDialogComponent, matDialogConfig);
    return this.dialogRef;
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
