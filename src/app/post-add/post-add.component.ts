import { Component, OnInit } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { HttpService } from "../utils/service/http/http.service";
import { LoaderService } from "../utils/service/loader/loader.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { FormBuilder, Validators } from "@angular/forms";

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: "app-post-add",
  templateUrl: "./post-add.component.html",
  styleUrls: ["./post-add.component.css"]
})
export class PostAddComponent implements OnInit {
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
  allCategories = [];
  selectedCategory: string = null;
  selectedSubCategory: string = null;

  categoryForm = this.formBuilder.group({
    category: ["", Validators.required],
    subCategory: ["", Validators.required]
  });
  constructor(
    private httpService: HttpService,
    private loaderService: LoaderService,
    private snackBarService: SnackbarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
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
        let subcategories = [];
        category.subcategories.map(subcategory => {
          subcategories.push({ name: subcategory });
        });
        this.allCategories.push({ name: category.category_name, children: subcategories });
      });
    }
    this.dataSource.data = this.allCategories;
  }

  hasChild = (_: number, node: FlatNode) => node["expandable"];

  selectCategory(node, stepper) {
    this.categoryForm.controls["subCategory"].setValue(node.name);
    let category = this.getParentCategory(node.name);
    this.categoryForm.controls["category"].setValue(category);
    stepper.next();
  }

  getParentCategory(nodeName) {
    for (let i = 0; i < this.allCategories.length; i++) {
      for (let j = 0; j < this.allCategories[i].children.length; j++) {
        if (this.allCategories[i].children[j].name === nodeName) {
          return this.allCategories[i].name;
        }
      }
    }
  }
}
