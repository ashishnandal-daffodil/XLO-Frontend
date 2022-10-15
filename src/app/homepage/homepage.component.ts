import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpService } from "../utils/service/http/http.service";
import _ from "lodash";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { LoaderService } from "../utils/service/loader/loader.service";
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
  loggedInUser: object = null;
  productSelected: object = null;

  @ViewChild("scrollframe") scrollFrame: ElementRef;

  constructor(
    private httpService: HttpService,
    public localStorageService: LocalStorageService,
    private snackBarService: SnackbarService,
    private loaderServie: LoaderService
  ) {}

  ngOnInit() {
    this.getProducts().then(() => {
      this.loggedInUser = this.localStorageService.getItem("loggedInUser");
      if (this.loggedInUser) {
        this.getUserFavorites(this.loggedInUser["_id"]);
      }
    });
  }

  ngAfterViewInit() {
    this.scrollContainer = _.get(this.scrollFrame, "nativeElement");
  }

  isUserNearBottom(): boolean {
    let threshold = 1;
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
    this.getProducts(true).then(() => {
      this.patchFavorites();
    });
  }

  getProducts(scrolled?) {
    return new Promise((resolve, reject) => {
      let filter = {};
      this.skip = scrolled ? this.skip + 1 : this.skip;
      filter["skip"] = this.skip * this.limit;
      filter["limit"] = this.limit;
      this.loaderServie.showLoader();
      this.httpService.getRequest(`products/allProduct/`, { ...filter }).subscribe(
        res => {
          this.products.push(...res);
          this.loaderServie.hideLoader();
          resolve(res);
        },
        err => {
          this.loaderServie.hideLoader();
          this.snackBarService.open(errorMessages.GET_PRODUCTS_ERROR, "error");
          reject(err);
        }
      );
    });
  }

  getUserFavorites(userId) {
    let filter = {};
    filter["userId"] = userId;
    this.loaderServie.showLoader();
    this.httpService.getRequest(`favorites/usersFavorites/`, { ...filter }).subscribe(
      res => {
        this.handleUserFavorites(res);
        this.loaderServie.hideLoader();
      },
      err => {
        this.loaderServie.hideLoader();
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
