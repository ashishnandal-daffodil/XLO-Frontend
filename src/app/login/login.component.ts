import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "../utils/service/http.service";
import { LocalStorageService } from "../utils/service/local.service";
import * as _ from "lodash";
import { Router } from "@angular/router";

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

  loginForm = new FormGroup({});
  userDetailsForm = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    public httpService: HttpService,
    public localStorageService: LocalStorageService,
    public fb: FormBuilder,
    public router: Router
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

  ngOnInit(): void {}

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
        console.log(err);
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
        console.log(err);
      }
    );
  }

  handleLogin(res) {
    this.isNewUser = res.body.message === "Old User" ? false : true;
    if (!this.isNewUser) {
      this.localStorageService.setAccessToken(res.body.token);
      this.localStorageService.setItem("loggedInUser", res.body.user);
      this.dialogRef.close();
      this.router.navigateByUrl("/");
    } else {
      this.accessToken = res.body.token;
      this.newUserId = res.body.user._id;
    }
  }

  handleLoginSuccess(res) {
    this.localStorageService.setAccessToken(this.accessToken);
    this.localStorageService.setItem("loggedInUser", res.body);
    this.dialogRef.close();
    this.router.navigateByUrl("/");
  }
}