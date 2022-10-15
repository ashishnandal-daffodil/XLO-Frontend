import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { HttpService } from "../utils/service/http/http.service";
import { Router } from "@angular/router";
import { OpenLoginDialogService } from "../utils/service/openLoginDialog/open-login-dialog.service";
import { UserProfileService } from "../utils/service/userProfile/user-profile.service";
@Component({
  selector: "app-navigation-bar",
  templateUrl: "./navigation-bar.component.html",
  styleUrls: ["./navigation-bar.component.css"]
})
export class NavigationBarComponent implements OnInit {
  loggedInUser: object = null;
  userProfileDialogOpen: Boolean = false;
  dialogRef: MatDialogRef<any>;

  @ViewChild("userProfile") userProfile: ElementRef;

  constructor(
    public dialog: MatDialog,
    public localStorageService: LocalStorageService,
    public httpService: HttpService,
    public openLoginDialogService: OpenLoginDialogService,
    public userProfileService: UserProfileService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
  }

  openLoginDialog() {
    this.openLoginDialogService.openLoginDialog();
  }

  handleUserProfileDialog() {
    if (this.userProfileDialogOpen) {
      this.closeUserProfileDialog();
    } else {
      this.openUserProfileDialog();
    }
  }

  openUserProfileDialog() {
    const dialogRef = this.userProfileService.openUserProfileDialog();
    dialogRef.updatePosition({ top: "65px", right: "8vw" });
    this.userProfileDialogOpen = true;
    dialogRef.afterClosed().subscribe(result => {
      this.userProfileDialogOpen = false;
    });
  }

  closeUserProfileDialog() {
    this.userProfileDialogOpen = false;
    this.userProfileService.closeDialog();
  }
}
