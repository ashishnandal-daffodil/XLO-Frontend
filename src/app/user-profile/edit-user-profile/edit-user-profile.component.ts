import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from "src/app/utils/service/http/http.service";
import { LoaderService } from "src/app/utils/service/loader/loader.service";
import { LocalStorageService } from "src/app/utils/service/localStorage/local.service";
import { errorMessages } from "src/app/utils/helpers/error-messages";
import { SnackbarService } from "src/app/utils/service/snackBar/snackbar.service";
import { successMessages } from "src/app/utils/helpers/success-messages";
@Component({
  selector: "app-edit-user-profile",
  templateUrl: "./edit-user-profile.component.html",
  styleUrls: ["./edit-user-profile.component.css"]
})
export class EditUserProfileComponent implements OnInit {
  loggedInUser: any;
  basicInfoForm = new FormGroup({});
  contactInfoForm = new FormGroup({});
  saveButtonDisabled: boolean = true;

  constructor(
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.initializeForms().then(result => {
      this.disableFields();
    });
  }

  initializeForms() {
    return new Promise((resolve, reject) => {
      this.contactInfoForm = this.formBuilder.group({
        mobile: [this.loggedInUser.mobile, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        email: [this.loggedInUser.email, [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]]
      });
      this.basicInfoForm = this.formBuilder.group({
        name: [
          this.loggedInUser.name,
          [Validators.required, Validators.minLength(1), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]
        ],
        about_me: [this.loggedInUser.about_me]
      });
      resolve(true);
    });
  }

  get basicInfoFormControls() {
    return this.basicInfoForm.controls;
  }

  get contactInfoFormControls() {
    return this.contactInfoForm.controls;
  }

  disableFields() {
    if (this.contactInfoForm.value.mobile) {
      this.contactInfoForm.get("mobile").disable({ onlySelf: true });
    }
    if (this.contactInfoForm.value.email) {
      this.contactInfoForm.get("email").disable({ onlySelf: true });
    }
  }

  disableSaveButton() {
    var basicInfoFormControls = this.basicInfoFormControls;
    var contactInfoFormControls = this.contactInfoFormControls;
    if (
      !basicInfoFormControls.name.errors &&
      !contactInfoFormControls.mobile.errors &&
      !contactInfoFormControls.email.errors &&
      this.detectChanges()
    ) {
      this.saveButtonDisabled = false;
    } else {
      this.saveButtonDisabled = true;
    }
  }

  detectChanges() {
    var basicInfoFormControls = this.basicInfoFormControls;
    var contactInfoFormControls = this.contactInfoFormControls;
    if (
      basicInfoFormControls.name.value === this.loggedInUser.name &&
      basicInfoFormControls.about_me.value === this.loggedInUser.about_me &&
      contactInfoFormControls.mobile.value === this.loggedInUser.mobile &&
      contactInfoFormControls.email.value === this.loggedInUser.email
    ) {
      return false;
    } else {
      return true;
    }
  }

  discardChanges() {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.basicInfoForm.setValue({
      name: this.loggedInUser.name,
      about_me: this.loggedInUser.about_me
    });
    this.contactInfoForm.setValue({
      mobile: this.loggedInUser.mobile,
      email: this.loggedInUser.email
    });
  }

  saveChanges() {
    let body = {
      _id: this.loggedInUser._id,
      changes: {
        name: this.basicInfoForm.value.name,
        about_me: this.basicInfoForm.value.about_me,
        mobile: this.contactInfoForm.value.mobile,
        email: this.contactInfoForm.value.email
      }
    };
    this.loaderService.showLoader();
    this.httpService.putRequest(`users/update`, body).subscribe(
      res => {
        if (res.status === 200) {
          this.snackBarService.open(successMessages.DATA_UPDATED_SUCCESSFULLY, "success");
          this.localStorageService.setItem("loggedInUser", res.body);
        }
        this.loaderService.hideLoader();
        window.location.reload();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.UPDATE_FAILED_ERROR, "error");
      }
    );
  }
}
