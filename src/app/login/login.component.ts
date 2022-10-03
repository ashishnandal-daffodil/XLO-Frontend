import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "../utils/service/http.service";
import { LocalStorageService } from "../utils/service/local.service";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

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

  loginForm = new FormGroup({});
  userDetailsForm = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    public httpService: HttpService,
    public localStorageService: LocalStorageService,
    public fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar
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
    this.httpService.postRequest(`users/login`, body).subscribe(
      res => {
        this.handleLogin(res);
      },
      err => {
        this.snackBar.open(err, "", {
          panelClass: ["mat-snack-bar-error"]
        });
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
    this.httpService.putRequest(`users/update`, body).subscribe(
      res => {
        this.handleLoginSuccess(res);
      },
      err => {
        console.log("🚀 ~ file: login.component.ts ~ line 128 ~ LoginComponent ~ submit ~ err", err)
        this.snackBar.open(err, "", {
          panelClass: ["mat-snack-bar-error"]
        });
      }
    );
  }

  handleLogin(res) {
    this.isNewUser = res.body.message === "Old User" ? false : true;
    if (!this.isNewUser) {
      this.localStorageService.setAccessToken(res.body.token);
      this.localStorageService.setItem("loggedInUser", res.body.user);
      this.snackBar.open("Logged in successfully!!!", "", {
        panelClass: ["mat-snack-bar-success"]
      });
      setTimeout(() => {
        this.redirect();
      }, 1000);
    } else {
      this.accessToken = res.body.token;
      this.newUserId = res.body.user._id;
    }
  }

  handleLoginSuccess(res) {
    this.localStorageService.setAccessToken(this.accessToken);
    this.localStorageService.setItem("loggedInUser", res.body);
    this.snackBar.open("Logged in successfully!!!", "", {
      panelClass: ["mat-snack-bar-success"]
    });
    setTimeout(() => {
      this.redirect();
    }, 1000);
  }

  redirect() {
    this.dialogRef.close();
    this.redirectTo ? this.router.navigateByUrl(this.redirectTo) : this.router.navigateByUrl("/");
  }
}
