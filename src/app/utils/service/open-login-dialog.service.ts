import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "src/app/login/login.component";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class OpenLoginDialogService {
  constructor(public dialog: MatDialog, public router: Router) {}

  openLoginDialog(redirectTo?) {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (redirectTo) {
        this.router.navigateByUrl(redirectTo);
      } else {
        window.location.reload();
      }
    });
  }
}
