import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpService } from "../utils/service/http/http.service";
import _ from "lodash";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { LoaderService } from "../utils/service/loader/loader.service";
import { ActivatedRoute } from "@angular/router";
import { infoMessages } from "../utils/helpers/info-messages";
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

  @ViewChild("scrollframe", { static: false }) scrollFrame: ElementRef;

  constructor(
    private httpService: HttpService,
    public localStorageService: LocalStorageService,
    private snackBarService: SnackbarService,
    private loaderServie: LoaderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.filterKey = this.route.snapshot.queryParamMap.get("filter");
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    let filter = {};
    if (this.loggedInUser) {
      filter = { filter: { userId: this.loggedInUser._id } };
    }
    this.getProducts(filter).then(() => {
      if (this.loggedInUser) {
        this.getUserFavorites(this.loggedInUser["_id"]);
      }
    });
  }

  isUserNearBottom(): boolean {
    let threshold = 1;
    this.scrollContainer = _.get(this.scrollFrame, "nativeElement");
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled() {
    this.isNearBottom = this.isUserNearBottom();
    if (this.isNearBottom) {
      this.onScroll();
    }
  }

  onScroll() {
    this.getProducts({ scrolled: true }).then(() => {
      this.patchFavorites();
    });
  }

  getProducts(params?) {
    return new Promise((resolve, reject) => {
      this.pageLoading = true;
      let filter = {};
      let userId = params?.filter?.userId;
      this.skip = params?.scrolled ? this.skip + 1 : this.skip;
      filter["skip"] = this.skip * this.limit;
      filter["limit"] = this.limit;
      if (userId) {
        filter["userId"] = userId;
      }
      if (this.filterKey) {
        filter["filterKey"] = this.filterKey;
      }
      this.loaderServie.showLoader();
      this.httpService.getRequest(`products/allProduct/`, { ...filter }).subscribe(
        res => {
          if (!res.length && this.products.length) {
            this.snackBarService.open(infoMessages.NO_MORE_PRODUCTS_AVAILABLE, "info");
          }
          this.products.push(...res);
          this.loaderServie.hideLoader();
          this.pageLoading = false;
          resolve(res);
        },
        err => {
          this.loaderServie.hideLoader();
          this.pageLoading = false;
          this.snackBarService.open(errorMessages.GET_PRODUCTS_ERROR, "error");
          reject(err);
        }
      );
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
        this.snackBarService.open(errorMessages.GET_USER_FAVORITES_ERROR, "error");
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
}
