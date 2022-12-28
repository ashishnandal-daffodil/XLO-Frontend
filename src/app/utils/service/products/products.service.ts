import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { errorMessages } from "../../helpers/error-messages";
import { HttpService } from "../http/http.service";
import { LoaderService } from "../loader/loader.service";
import { SnackbarService } from "../snackBar/snackbar.service";

@Injectable({
  providedIn: "root"
})
export class ProductsService {
  constructor(
    private loaderService: LoaderService,
    private httpService: HttpService,
    private snackBarService: SnackbarService
  ) {}

  getAllProducts = filter => {
    return new Observable(observer => {
      this.loaderService.showLoader();
      this.httpService.getRequest(`products/allProduct/`, { ...filter }).subscribe(
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
  };

  getLatestSuggestions = filter => {
    return new Observable(observer => {
      this.loaderService.showLoader();
      this.httpService.getRequest(`products/suggestions/`, { ...filter }).subscribe(
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
  };

  getMyAds = filter => {
    return new Observable(observer => {
      this.loaderService.showLoader();
      this.httpService.getRequest(`products/myAds/`, { ...filter }).subscribe(
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
  };
}
