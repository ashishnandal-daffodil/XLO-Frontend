import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { LocalStorageService } from "src/app/utils/service/localStorage/local.service";
import { LoaderService } from "src/app/utils/service/loader/loader.service";
import { SnackbarService } from "src/app/utils/service/snackBar/snackbar.service";
import { errorMessages } from "src/app/utils/helpers/error-messages";
import { successMessages } from "src/app/utils/helpers/success-messages";
import { infoMessages } from "src/app/utils/helpers/info-messages";
import { HttpService } from "src/app/utils/service/http/http.service";
import _ from "lodash";
import { Router } from "@angular/router";

@Component({
  selector: "app-view-profile",
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.css"]
})
export class ViewProfileComponent implements OnInit {
  showFiller: boolean = false;
  imgSrc: string = null;
  loggedInUser: any;
  nameInitials: string = "";
  numberOfFollowers: number = 0;
  numberOfFollowing: number = 0;
  pageLoading: boolean = false;
  scrollContainer: any;
  isNearBottom: boolean = false;
  skip: number = 0;
  limit: number = 15;
  products = [];
  userFavorites = [];
  productSelected: object = null;

  @ViewChild("scrollframe", { static: false }) scrollFrame: ElementRef;

  @Output() selectTabIndexEvent = new EventEmitter<number>();

  constructor(
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private snackBarService: SnackbarService,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.getMyAds().then(() => {
      this.getUserFavorites(this.loggedInUser["_id"]);
    });
  }

  ngAfterViewInit(): void {
    if (this.loggedInUser.profile_image_filename) {
      this.imgSrc = `http://localhost:3000/users/profileimage/${this.loggedInUser.profile_image_filename}`;
    } else {
      this.extractNameInitials();
    }
  }

  extractNameInitials() {
    let name = this.loggedInUser.name;
    let nameSplit = name.split(" ");
    nameSplit.forEach((name, index) => {
      index < 2 ? (this.nameInitials += name.charAt(0)) : null;
    });
  }

  scrolled() {
    this.isNearBottom = this.isUserNearBottom();
    if (this.isNearBottom) {
      this.onScroll();
    }
  }

  isUserNearBottom(): boolean {
    let threshold = 1;
    this.scrollContainer = _.get(this.scrollFrame, "nativeElement");
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  onScroll() {
    this.getMyAds({ scrolled: true }).then(() => {
      this.patchFavorites();
    });
  }

  getUserFavorites(userId) {
    this.pageLoading = true;
    let filter = {};
    filter["userId"] = userId;
    this.loaderService.showLoader();
    this.httpService.getRequest(`favorites/usersFavorites/`, { ...filter }).subscribe(
      res => {
        this.handleUserFavorites(res);
        this.loaderService.hideLoader();
        this.pageLoading = false;
      },
      err => {
        this.loaderService.hideLoader();
        this.pageLoading = false;
        this.snackBarService.open(errorMessages.GET_USER_FAVORITES_ERROR, "error");
      }
    );
  }

  getMyAds(params?) {
    return new Promise((resolve, reject) => {
      this.pageLoading = true;
      let filter = {};
      this.skip = params?.scrolled ? this.skip + 1 : this.skip;
      filter["userId"] = this.loggedInUser._id;
      filter["skip"] = this.skip * this.limit;
      filter["limit"] = this.limit;
      this.loaderService.showLoader();
      this.httpService.getRequest(`products/myAds/`, { ...filter }).subscribe(
        res => {
          if (!res.length && this.products.length) {
            this.snackBarService.open(infoMessages.NO_MORE_PRODUCTS_AVAILABLE, "info");
          }
          this.products.push(...res);
          this.loaderService.hideLoader();
          this.pageLoading = false;
          resolve(res);
        },
        err => {
          this.loaderService.hideLoader();
          this.pageLoading = false;
          this.snackBarService.open(errorMessages.GET_PRODUCTS_ERROR, "error");
          reject(err);
        }
      );
    });
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

  selectTabIndex(index) {
    this.selectTabIndexEvent.emit(index);
  }

  redirectToSellProduct() {
    this.router.navigateByUrl(`/postAdd/${this.loggedInUser._id}`);
  }
}
