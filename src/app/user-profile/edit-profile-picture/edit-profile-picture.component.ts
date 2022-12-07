import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "src/app/utils/service/localStorage/local.service";
import { HttpService } from "src/app/utils/service/http/http.service";
import { LoaderService } from "src/app/utils/service/loader/loader.service";
import { SnackbarService } from "src/app/utils/service/snackBar/snackbar.service";
import { errorMessages } from "src/app/utils/helpers/error-messages";
import { successMessages } from "src/app/utils/helpers/success-messages";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-edit-profile-picture",
  templateUrl: "./edit-profile-picture.component.html",
  styleUrls: ["./edit-profile-picture.component.css"]
})
export class EditProfilePictureComponent implements OnInit {
  imgSrc: string = null;
  loggedInUser: any;
  nameInitials: string = "";
  constructor(
    private localStorageService: LocalStorageService,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
  }

  ngAfterViewInit(): void {
    if (this.loggedInUser){
      if (this.loggedInUser?.profile_image_filename) {
        this.imgSrc = `${environment.baseUrl}/users/profileimage/${this.loggedInUser.profile_image_filename}`;
      }
    }
  }

  uploadFile() {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = _ => {
      // you can use this method to get file and perform respective operations
      let files = Array.from(input.files);
      this.readImage(files[0]);
    };
    input.click();
  }

  readImage(file) {
    this.loaderService.showLoader();
    // Check if the file is an image.
    if (file.type && (!file.type.startsWith("image/") || file.type.startsWith("image/gif"))) {
      this.snackBarService.open(errorMessages.NOT_AN_IMAGE, "error");
      this.loaderService.hideLoader();
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", event => {
      this.resetNameInitials();
      let formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("_id", this.loggedInUser._id);
      this.httpService.postRequest(`users/upload`, formData).subscribe(
        res => {
          this.imgSrc = `${environment.baseUrl}/users/profileimage/${res.profile_image_filename}`;
          this.localStorageService.setItem("loggedInUser", res);
          this.loaderService.hideLoader();
          this.localStorageService.setItem("userProfileSelectedTabIndex", 1);
          window.location.reload();
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.UPDATE_FAILED_ERROR, "error");
        }
      );
    });
    reader.readAsDataURL(file);
  }

  deleteImage() {
    this.imgSrc = null;
    let body = {
      _id: this.loggedInUser._id,
      profile_image_filename: this.loggedInUser.profile_image_filename
    };
    this.httpService.putRequest("users/deleteprofileimage", body).subscribe(
      res => {
        this.localStorageService.setItem("loggedInUser", res.body);
        this.loaderService.hideLoader();
        this.localStorageService.setItem("userProfileSelectedTabIndex", 1);
        window.location.reload();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.REMOVE_DATA_ERROR, "error");
      }
    );
  }

  resetNameInitials() {
    this.nameInitials = "";
  }
}
