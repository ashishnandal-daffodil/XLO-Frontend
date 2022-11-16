import { Component, ElementRef, Inject, OnInit } from "@angular/core";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { LoaderService } from "../utils/service/loader/loader.service";
import { HttpService } from "../utils/service/http/http.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { successMessages } from "../utils/helpers/success-messages";
import { Router } from "@angular/router";
import { UserProfileService } from "../utils/service/userProfile/user-profile.service";

@Component({
  selector: "app-user-profile-dialog",
  templateUrl: "./user-profile-dialog.component.html",
  styleUrls: ["./user-profile-dialog.component.css"]
})
export class UserProfileDialogComponent implements OnInit {
  loggedInUser: any = {};
  imgSrc: string = null;
  nameInitials: string = "";

  constructor(
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private snackBarService: SnackbarService,
    private router: Router,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
  }

  ngAfterViewInit(): void {
    if (this.loggedInUser) {
      if (this.loggedInUser?.profile_image_filename) {
        this.imgSrc = `http://localhost:3000/users/profileimage/${this.loggedInUser.profile_image_filename}`;
      } else {
        this.extractNameInitials();
      }
    }
  }

  extractNameInitials() {
    let name = this.loggedInUser.name;
    let nameSplit = name.split(" ");
    nameSplit.forEach((name, index) => {
      index < 2 ? (this.nameInitials += name.charAt(0)) : null;
    });
  }

  logOut() {
    this.userProfileService.closeDialog();
    let body = {
      token: this.localStorageService.getItem("auth")
    };
    this.loaderService.showLoader();
    this.httpService.postRequest(`users/logout`, body).subscribe(
      res => {
        this.handleLogout(res);
        this.loaderService.hideLoader();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.LOGOUT_ERROR, "error");
      }
    );
  }

  handleLogout(res) {
    this.localStorageService.clearLocalStorage();
    this.snackBarService.open(successMessages.LOGOUT_SUCCESS, "success");
    setTimeout(() => {
      this.router.navigateByUrl("/").then(() => {
        window.location.reload();
      });
    }, 2000);
  }

  openMyAds() {
    this.userProfileService.closeDialog();
    this.localStorageService.setItem("userProfileSelectedTabIndex", 2);
    // redirect to MyAds page
    this.router.navigateByUrl(`/userProfile/${this.loggedInUser["_id"]}`);
  }

  openMyChats() {
    this.userProfileService.closeDialog();
    this.localStorageService.setItem("userProfileSelectedTabIndex", 2);
    // redirect to MyChats page
    this.router.navigateByUrl(`/chat/${this.loggedInUser["_id"]}`);
  }

  handleViewEditProfile() {
    this.userProfileService.closeDialog();
    this.router.navigateByUrl(`/userProfile/${this.loggedInUser["_id"]}`);
  }
}
