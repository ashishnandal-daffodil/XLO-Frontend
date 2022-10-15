import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "src/app/login/login.component";
import { Router } from "@angular/router";
import { LocalStorageService } from "../localStorage/local.service";

@Injectable({
  providedIn: "root"
})
export class OpenLoginDialogService {
  constructor(public dialog: MatDialog, public router: Router, private localStorageService: LocalStorageService) {}

  openLoginDialog(redirectTo?) {
    this.localStorageService.setItem("redirectTo", redirectTo);
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }
}
