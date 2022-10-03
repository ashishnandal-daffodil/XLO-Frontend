import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "../login/login.component";
import { LocalStorageService } from "../utils/service/local.service";
import { HttpService } from "../utils/service/http.service";
import { Router } from "@angular/router";
import { OpenLoginDialogService } from "../utils/service/open-login-dialog.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-navigation-bar",
  templateUrl: "./navigation-bar.component.html",
  styleUrls: ["./navigation-bar.component.css"]
})
export class NavigationBarComponent implements OnInit {
  loggedInUser: object = null;

  constructor(
    public dialog: MatDialog,
    public localStorageService: LocalStorageService,
    public httpService: HttpService,
    public openLoginDialogService: OpenLoginDialogService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
  }

  openLoginDialog() {
    this.openLoginDialogService.openLoginDialog();
  }

  logOut() {
    let body = {
      token: this.localStorageService.getItem("auth")
    };
    this.httpService.postRequest(`users/logout`, body).subscribe(
      res => {
        this.handleLogout(res);
      },
      err => {
        this.snackBar.open(err, "", {
          panelClass: ["mat-snack-bar-error"]
        });
      }
    );
  }

  handleLogout(res) {
    this.localStorageService.clearLocalStorage();
    this.snackBar.open("Logged out successfully!!!", '', {
      panelClass: ['mat-snack-bar-success']
    });
    setTimeout(() => {
      this.router.navigateByUrl("/").then(() => {
        window.location.reload();
      });
    }, 2000);
  }
}
