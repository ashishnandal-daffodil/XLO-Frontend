import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "src/app/utils/service/localStorage/local.service";
import { LoaderService } from "src/app/utils/service/loader/loader.service";
import { HttpService } from "src/app/utils/service/http/http.service";
import { SnackbarService } from "src/app/utils/service/snackBar/snackbar.service";
import { Router } from "@angular/router";
import { errorMessages } from "src/app/utils/helpers/error-messages";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { FlatTreeControl } from "@angular/cdk/tree";
import { CategoriesService } from "src/app/utils/service/categories/categories.service";

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Component({
  selector: "app-all-catgeories-dialog",
  templateUrl: "./all-categories-dialog.component.html",
  styleUrls: ["./all-categories-dialog.component.css"]
})
export class AllCatgeoriesDialogComponent implements OnInit {
  loggedInUser: any = {};
  allCategories = [];
  selectedCategory: string;

  private _transformer = (node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node["level"],
    node => node["expandable"]
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  constructor(
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private snackBarService: SnackbarService,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.categoriesService.getCategories.subscribe(res => {
      this.handleCategories(res);
    });
  }

  handleCategories(data) {
    if (data.length > 0) {
      data.map(category => {
        let subcategories = [];
        category.subcategories.map(subcategory => {
          subcategories.push({ name: subcategory });
        });
        this.allCategories.push({ name: category.category_name, children: subcategories });
      });
    }
    this.dataSource.data = this.allCategories;
  }

  handleSelectCategory(filter) {
    this.router.navigate(["/"], { queryParams: { filter: filter } }).then(() => {
      window.location.reload();
    });
  }

  hasChild = (_: number, node: FlatNode) => node["expandable"];

  selectCategory(node) {
    this.handleSelectCategory(node.name);
  }
}
