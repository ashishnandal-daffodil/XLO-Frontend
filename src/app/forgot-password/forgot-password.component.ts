import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { HttpService } from "../utils/service/http/http.service";
import { LoaderService } from "../utils/service/loader/loader.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { successMessages } from "../utils/helpers/success-messages";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { errorMessages } from "../utils/helpers/error-messages";
import { OpenLoginDialogService } from "../utils/service/openLoginDialog/open-login-dialog.service";
import { staticVariables } from "../utils/helpers/static-variables";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
  resetPasswordForm = new FormGroup({});
  newPasswordVisible: boolean = false;
  confirmNewPasswordVisible: boolean = false;
  resetPasswordButtonDisabled: boolean = true;
  resetPasswordTokenExpired: boolean = false;
  email: string = "";
  token: string = "";

  constructor(
    public fb: FormBuilder,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private snackBarService: SnackbarService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = fb.group(
      {
        NewPassword: [
          "",
          [
            Validators.required,
            Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}$")
          ]
        ],
        ConfirmNewPassword: [
          "",
          [
            Validators.required,
            Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}$")
          ]
        ]
      },
      {
        validator: this.matchPassword
      }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get("token");
    this.verifyResetPasswordToken(this.token);
  }

  verifyResetPasswordToken(token) {
    let filter = {};
    filter["resetPasswordToken"] = token;
    this.loaderService.showLoader();
    this.httpService.getRequest(`users/verifyResetPasswordToken`, { ...filter }).subscribe(
      res => {
        this.email = res.email;
        let resetTokenCreatedOn = res.reset_password_token.created_on;
        let difference = moment().diff(moment(resetTokenCreatedOn), "seconds");
        if (difference > staticVariables.resetPasswordTokenExpiryTime) {
          this.resetPasswordTokenExpired = true;
          this.removeResetPasswordTokenFromDB(token);
        }
        this.loaderService.hideLoader();
      },
      err => {
        this.loaderService.hideLoader();
        this.resetPasswordTokenExpired = true;
        this.snackBarService.open(err.error.message, "error");
      }
    );
  }

  removeResetPasswordTokenFromDB(token) {
    let filter = {};
    filter["resetPasswordToken"] = token;
    this.loaderService.showLoader();
    this.httpService.putRequest(`users/removeResetPasswordToken`, { ...filter }).subscribe(
      res => {
        this.loaderService.hideLoader();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(err.error.message, "error");
      }
    );
  }

  get forgotPasswordFormControls() {
    return this.resetPasswordForm.controls;
  }

  matchPassword(control: AbstractControl): ValidationErrors | null {
    const NewPassword = control.get("NewPassword").value;
    const ConfirmNewPassword = control.get("ConfirmNewPassword").value;

    if (NewPassword != ConfirmNewPassword) {
      return { "noMatch": true };
    }

    return null;
  }

  disableResetPasswordButton() {
    var controls = this.forgotPasswordFormControls;
    if (
      controls.NewPassword.errors ||
      controls.ConfirmNewPassword.errors ||
      controls.NewPassword.value != controls.ConfirmNewPassword.value
    ) {
      this.resetPasswordButtonDisabled = true;
    } else {
      this.resetPasswordButtonDisabled = false;
    }
  }

  toggleNewPasswordVisibility() {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmNewPasswordVisibility() {
    this.confirmNewPasswordVisible = !this.confirmNewPasswordVisible;
  }

  resetPasswordButton() {
    let filter = {};
    filter["newPassword"] = this.resetPasswordForm.value.ConfirmNewPassword;
    filter["registeredEmailAddress"] = this.email;
    this.loaderService.showLoader();
    this.httpService.putRequest(`users/changePassword`, { ...filter }).subscribe(
      res => {
        this.snackBarService.open(successMessages.PASSWORD_CHANGED_SUCCESSFULLY, "success");
        this.removeResetPasswordTokenFromDB(this.token);
        this.loaderService.hideLoader();
        setTimeout(() => {
          this.router.navigateByUrl("/");
        }, 3000);
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(err.error.message, "error");
      }
    );
  }
}
