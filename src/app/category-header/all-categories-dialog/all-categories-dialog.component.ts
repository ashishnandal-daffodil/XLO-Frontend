import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "src/app/utils/service/localStorage/local.service";
import { LoaderService } from "src/app/utils/service/loader/loader.service";
import { HttpService } from "src/app/utils/service/http/http.service";
import { SnackbarService } from "src/app/utils/service/snackBar/snackbar.service";
import { Router } from "@angular/router";
import { errorMessages } from "src/app/utils/helpers/error-messages";
@Component({
  selector: "app-all-catgeories-dialog",
  templateUrl: "./all-categories-dialog.component.html",
  styleUrls: ["./all-categories-dialog.component.css"]
})
export class AllCatgeoriesDialogComponent implements OnInit {
  loggedInUser: any = {};
  allCategories = [];
  selectedCategory: string;

  constructor(
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private snackBarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.getCategories();
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      this.loaderService.showLoader();
      this.httpService.getRequest(`categories/allCategories/`).subscribe(
        res => {
          this.handleCategories(res);
          this.loaderService.hideLoader();
          resolve(res);
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.GET_CATEGORIES_ERROR, "error");
          reject(err);
        }
      );
    });
  }

  handleCategories(data) {
    if (data.length > 0) {
      data.map(category => {
        this.allCategories.push(category.category_name);
      });
    }
  }

  handleSelectCategory(filter) {
    this.router.navigate(["/"], { queryParams: { filter: filter } }).then(() => {
      window.location.reload();
    });
  }
}
