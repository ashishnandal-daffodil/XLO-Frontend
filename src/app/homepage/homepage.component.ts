import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpService } from "../utils/service/http/http.service";
import _ from "lodash";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { LoaderService } from "../utils/service/loader/loader.service";
import { ActivatedRoute, Router } from "@angular/router";
import { infoMessages } from "../utils/helpers/info-messages";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ChatService } from "../utils/service/chat/chat.service";
import { ProductsService } from "../utils/service/products/products.service";
@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"]
})
export class HomepageComponent implements OnInit {
  scrollContainer: any;
  isNearBottom: boolean = false;
  skip: number = 0;
  limit: number = 15;
  products = [];
  userFavorites = [];
  loggedInUser: any = null;
  productSelected: object = null;
  filterKey: string = null;
  pageLoading: boolean;
  filters: any = [];
  sortByOptions = ["Price: Low to High", "Price: High to Low", "Date Published"];
  // budgetValue = 0;

  advanceFilterForm = new FormGroup({});

  @ViewChild("scrollframe", { static: false }) scrollFrame: ElementRef;

  constructor(
    private httpService: HttpService,
    public localStorageService: LocalStorageService,
    private snackBarService: SnackbarService,
    private loaderServie: LoaderService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private chatService: ChatService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.filterKey = this.route.snapshot.queryParamMap.get("filter");
    if (this.filterKey) {
      this.filters.push(this.filterKey);
    }
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    let filter = {};
    if (this.loggedInUser) {
      filter = { filter: { userId: this.loggedInUser._id } };
      //create new socket connection
      this.chatService.login();
    }
    this.getProducts(filter).then(() => {
      if (this.loggedInUser) {
        this.getUserFavorites(this.loggedInUser["_id"]);
      }
    });
    this.initializeForms();
  }

  initializeForms() {
    return new Promise((resolve, reject) => {
      this.advanceFilterForm = this.formBuilder.group({
        sortBy: [""]
        // budgetFrom: ["0"],
        // budgetTo: ["200001"]
      });
      resolve(true);
    });
  }

  isUserNearBottom(): boolean {
    let threshold = 1;
    this.scrollContainer = _.get(this.scrollFrame, "nativeElement");
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position >= height - threshold;
  }

  scrolled() {
    this.isNearBottom = this.isUserNearBottom();
    if (this.isNearBottom) {
      this.onScroll();
    }
  }

  onScroll() {
    let filter = { scrolled: true };
    if (this.loggedInUser) {
      filter["filter"] = { userId: this.loggedInUser._id };
    }
    this.getProducts(filter).then(() => {
      this.patchFavorites();
    });
  }

  getProducts(params?) {
    return new Promise((resolve, reject) => {
      this.pageLoading = true;
      let filter = {};
      let userId = params?.filter?.userId;
      filter["skip"] = this.skip * this.limit;
      filter["limit"] = this.limit;
      if (params?.sort) {
        filter["sort"] = JSON.stringify(params?.sort);
      }
      if (userId) {
        filter["userId"] = userId;
      }
      if (this.filterKey) {
        filter["filterKey"] = this.filterKey;
      }
      this.productsService.getAllProducts(filter).subscribe(res => {
        if (!res["length"] && this.products.length) {
          this.snackBarService.open(infoMessages.NO_MORE_PRODUCTS_AVAILABLE, "info");
        }
        if (res["length"] > 0) {
          this.skip = this.skip + 1;
        }
        this.products.push(...(<[]>res));
        this.pageLoading = false;
      });
    });
  }

  getUserFavorites(userId) {
    this.pageLoading = true;
    let filter = {};
    filter["userId"] = userId;
    this.loaderServie.showLoader();
    this.httpService.getRequest(`favorites/usersFavorites/`, { ...filter }).subscribe(
      res => {
        this.handleUserFavorites(res);
        this.loaderServie.hideLoader();
        this.pageLoading = false;
      },
      err => {
        this.loaderServie.hideLoader();
        this.pageLoading = false;
        this.snackBarService.open(errorMessages.FETCH_DATA_ERROR, "error");
      }
    );
  }

  handleUserFavorites(res) {
    const userFavorites = res;
    userFavorites.forEach(favorite => {
      if (favorite.favorite) {
        this.userFavorites.push(favorite["product"]);
      }
    });
    this.patchFavorites();
  }

  patchFavorites() {
    this.products.forEach(product => {
      if (this.userFavorites.includes(product["_id"])) {
        product.isUserFavorite = true;
      } else {
        product.isUserFavorite = false;
      }
    });
  }

  setSelectedProduct(productDetails) {
    this.productSelected = productDetails;
  }

  remove(filter: string): void {
    this.skip = 0;
    const index = this.filters.indexOf(filter);
    if (index >= 0) {
      this.filters.splice(index, 1);
    }
    this.router.navigateByUrl("/");
    this.products = [];
    this.userFavorites = [];
    this.filterKey = null;
    let userFilter = {};
    if (this.loggedInUser) {
      userFilter = { filter: { userId: this.loggedInUser._id } };
    }
    this.getProducts(userFilter).then(() => {
      if (this.loggedInUser) {
        this.getUserFavorites(this.loggedInUser["_id"]);
      }
    });
  }

  sortProducts() {
    // Create a new filter, append the sory by filter and get products accordingly
    this.skip = 0;
    let filter = {};
    let sortBy = this.advanceFilterForm.get("sortBy").value;
    if (this.loggedInUser) {
      filter = { filter: { userId: this.loggedInUser._id } };
    }
    switch (sortBy) {
      case "Price: Low to High":
        filter["sort"] = { "price": 1 };
        break;
      case "Price: High to Low":
        filter["sort"] = { "price": -1 };
        break;
      case "Date Published":
        filter["sort"] = { "created_on": -1 };
        break;
      default:
        filter["sort"] = null;
    }

    this.products = [];
    this.userFavorites = [];
    this.getProducts(filter).then(() => {
      if (this.loggedInUser) {
        this.getUserFavorites(this.loggedInUser["_id"]);
      }
    });
  }
}
