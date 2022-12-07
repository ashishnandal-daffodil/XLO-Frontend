import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { errorMessages } from "../../helpers/error-messages";
import { HttpService } from "../http/http.service";
import { LoaderService } from "../loader/loader.service";
import { SnackbarService } from "../snackBar/snackbar.service";

@Injectable({
  providedIn: "root"
})
export class CategoriesService {
  constructor(
    private httpService: HttpService,
    private loaderService: LoaderService,
    private snackBarService: SnackbarService
  ) {}

  getCategories = new Observable(observer => {
    this.loaderService.showLoader();
    this.httpService.getRequest(`categories/allCategories/`).subscribe(
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
