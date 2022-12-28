import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { errorMessages } from "../helpers/error-messages";
import { HttpService } from "../service/http/http.service";
import { LoaderService } from "../service/loader/loader.service";
import { LocalStorageService } from "../service/localStorage/local.service";
import { SnackbarService } from "../service/snackBar/snackbar.service";

@Injectable({
  providedIn: "root"
})
export class CommonAPIService {
  constructor(
    private httpService: HttpService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private snackBarService: SnackbarService
  ) {}

  getUserDetails(userId) {
    return new Observable(observer => {
      let filter = {};
      filter["userId"] = userId;
      this.loaderService.showLoader();
      this.httpService.getRequest(`users/getDetails`, { ...filter }).subscribe(
        res => {
          this.loaderService.hideLoader();
          observer.next(res);
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.FETCH_DATA_ERROR, "error");
          observer.error(err);
        }
      );
    });
  }

  getProductDetails(productId) {
    return new Observable(observer => {
      this.loaderService.showLoader();
      this.httpService.getRequest(`products/${productId}`).subscribe(
        res => {
          this.loaderService.hideLoader();
          observer.next(res);
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.FETCH_DATA_ERROR, "error");
          observer.error(err);
        }
      );
    });
  }
}
