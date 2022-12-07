import { Component, OnInit } from "@angular/core";
import { HttpService } from "../utils/service/http/http.service";
import { LoaderService } from "../utils/service/loader/loader.service";
import { OpenAllCategoriesService } from "../utils/service/openAllCategories/open-all-categories.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { Router } from "@angular/router";
import { CategoriesService } from "../utils/service/categories/categories.service";
@Component({
  selector: "app-category-header",
  templateUrl: "./category-header.component.html",
  styleUrls: ["./category-header.component.css"]
})
export class CategoryHeaderComponent implements OnInit {
  allCategoriesOpen: boolean = false;
  skip: number = 0;
  limit: number = 15;
  allCategories = [];
  constructor(
    private openAllCategoriesServce: OpenAllCategoriesService,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private snackBarService: SnackbarService,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.categoriesService.getCategories.subscribe(res => {
      this.handleCategories(res);
    });
  }

  handleCategories(data) {
    if (data.length > 0) {
      data.map(category => {
        this.allCategories.push(category.category_name);
      });
    }
  }

  handleAllCategories() {
    if (this.allCategoriesOpen) {
      this.closeAllCategories();
    } else {
      this.openAllCategories();
    }
  }

  openAllCategories() {
    const dialogRef = this.openAllCategoriesServce.openAllCategories();
    dialogRef.updatePosition({ top: "105px", left: "8vw" });
    this.allCategoriesOpen = true;
    dialogRef.afterClosed().subscribe(result => {
      this.allCategoriesOpen = false;
    });
  }

  closeAllCategories() {
    this.openAllCategoriesServce.closeDialog();
  }

  handleSelectCategory(filter) {
    this.router.navigate(["/"], { queryParams: { filter: filter } }).then(() => {
      window.location.reload();
    });
  }
}
