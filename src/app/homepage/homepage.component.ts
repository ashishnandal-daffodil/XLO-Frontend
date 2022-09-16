import { Component, OnInit, ViewChild, ElementRef, Output } from "@angular/core";
import { HttpService } from "../utils/service/http.service";
import _ from "lodash";
import { LocalStorageService } from "../utils/service/local.service";

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

  constructor(private httpService: HttpService, public localStorageService: LocalStorageService) {}

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
      this.httpService.getRequest(`products/allProduct/`, { ...filter }).subscribe(
        res => {
          this.products.push(...res);
          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  getUserFavorites(userId) {
    let filter = {};
    filter["userId"] = userId;
    this.httpService.getRequest(`favorites/usersFavorites/`, { ...filter }).subscribe(
      res => {
        this.handleUserFavorites(res);
      },
      err => {
        console.log(err);
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
