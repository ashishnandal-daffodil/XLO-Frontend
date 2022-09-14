import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
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
  submitButtonDisabled: boolean = true;
  loggedInUser: object = null;

  loginForm = new FormGroup({});

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
      password: ["", [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$")]],
    });
  }

  ngOnInit(): void {}

  setModal(value) {
    this.openModal = value;
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }

  disableLoginSignupButton() {
    var controls = this.loginFormControls;
    if (this.openModal === "Email") {
      if (!controls.Email.errors && !controls.password.errors) {
        this.submitButtonDisabled = false;
      } else {
        this.submitButtonDisabled = true;
      }
    } else if (this.openModal === "PhoneNumber") {
      if (!controls.PhoneNumber.errors && !controls.password.errors) {
        this.submitButtonDisabled = false;
      } else {
        this.submitButtonDisabled = true;
      }
    } else {
      this.submitButtonDisabled = true;
    }
  }

  submit() {
    let body = {
      username: "xlo",
      email: this.loginForm.value.Email,
      phone: this.loginForm.value.PhoneNumber,
      password: this.loginForm.value.password
    };
    this.httpService.postRequest(`users/login`, body).subscribe(
      res => {
        this.handleLoginSuccess(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  handleLoginSuccess(res) {
    this.localStorageService.setAccessToken(_.invoke(res.headers, "get", "Authorization"));
    this.localStorageService.setItem("loggedInUser", res.body.user);
    this.dialogRef.close();
    this.router.navigateByUrl('/')
    // this.loggedInUser = res.body.user;
  }
}
