import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "../utils/service/http/http.service";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { LoaderService } from "../utils/service/loader/loader.service";
import { successMessages } from "../utils/helpers/success-messages";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  openModal: string = null;
  loginSignupButtonDisabled: boolean = true;
  submitButtonDisabled: boolean = true;
  loggedInUser: object = null;
  isNewUser: boolean = false;
  newUserId: string = "";
  accessToken: string = null;
  redirectTo: string = null;
  showPassword: boolean = false;
  passwordVisible: boolean = false;

  loginForm = new FormGroup({});
  userDetailsForm = new FormGroup({});

  @ViewChild("password") password: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    public httpService: HttpService,
    public localStorageService: LocalStorageService,
    public fb: FormBuilder,
    public router: Router,
    private snackBarService: SnackbarService,
    private loaderService: LoaderService,
  ) {
    this.loginForm = fb.group({
      PhoneNumber: ["", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      Email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}$")
        ]
      ]
    });
    this.userDetailsForm = fb.group({
      Name: ["", [Validators.pattern("[a-zA-Z][a-zA-Z ]+")]]
    });
  }

  ngOnInit(): void {
    this.redirectTo = this.localStorageService.getItem("redirectTo");
  }

  setModal(value) {
    this.openModal = value;
    this.disableLoginSignupButton();
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }

  get userDetailsFormControls() {
    return this.userDetailsForm.controls;
  }

  disableLoginSignupButton() {
    var controls = this.loginFormControls;
    if (this.openModal === "Email") {
      if (!controls.Email.errors && !controls.password.errors) {
        this.loginSignupButtonDisabled = false;
      } else {
        this.loginSignupButtonDisabled = true;
      }
    } else if (this.openModal === "PhoneNumber") {
      if (!controls.PhoneNumber.errors && !controls.password.errors) {
        this.loginSignupButtonDisabled = false;
      } else {
        this.loginSignupButtonDisabled = true;
      }
    } else {
      this.loginSignupButtonDisabled = true;
    }
  }

  disableSubmitButton() {
    var controls = this.userDetailsFormControls;
    if (!controls.Name.errors) {
      this.submitButtonDisabled = false;
    } else {
      this.submitButtonDisabled = true;
    }
  }

  loginSignup() {
    let body = {
      username: "xlo",
      email: this.loginForm.value.Email,
      phone: this.loginForm.value.PhoneNumber,
      password: this.loginForm.value.password
    };
    this.loaderService.showLoader();
    this.httpService.postRequest(`users/login`, body).subscribe(
      res => {
        this.handleLogin(res);
        this.loaderService.hideLoader();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.LOGIN_ERROR, "error");
      }
    );
  }

  submit() {
    let body = {
      _id: this.newUserId,
      changes: {
        name: this.userDetailsForm.value.Name
      }
    };
    this.loaderService.showLoader();
    this.httpService.putRequest(`users/update`, body).subscribe(
      res => {
        this.handleLoginSuccess(res);
        this.loaderService.hideLoader();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.UPDATE_FAILED_ERROR, "error");
      }
    );
  }

  handleLogin(res) {
    this.isNewUser = res.body.message === "Old User" ? false : true;
    if (!this.isNewUser) {
      this.localStorageService.setAccessToken(res.body.token);
      this.localStorageService.setItem("loggedInUser", res.body.user);
      this.snackBarService.open(successMessages.LOGIN_SUCCESS, "success");
      setTimeout(() => {
        this.redirect();
      }, 1000);
    } else {
      this.accessToken = res.body.token;
      this.newUserId = res.body.user._id;
      this.snackBarService.open(successMessages.NEW_ACCOUNT_CREATED_SUCCESS, "success");
    }
  }

  handleLoginSuccess(res) {
    this.localStorageService.setAccessToken(this.accessToken);
    this.localStorageService.setItem("loggedInUser", res.body);
    this.snackBarService.open(successMessages.LOGIN_SUCCESS, "success");
    setTimeout(() => {
      this.redirect();
    }, 1000);
  }

  redirect() {
    this.dialogRef.close();
    this.redirectTo ? this.router.navigateByUrl(this.redirectTo) : this.router.navigateByUrl("/");
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
