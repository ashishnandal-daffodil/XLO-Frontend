import { Component, OnInit, Input } from "@angular/core";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import _ from "lodash";
import * as moment from "moment";
import { HttpService } from "../utils/service/http/http.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DateService } from "../utils/service/date/date.service";
import { staticVariables } from "../utils/helpers/static-variables";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "../login/login.component";
import { ChatService } from "../utils/service/chat/chat.service";
import { OpenLoginDialogService } from "../utils/service/openLoginDialog/open-login-dialog.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { LoaderService } from "../utils/service/loader/loader.service";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"]
})
export class ProductDetailsComponent {
  createdOn: String;
  location: String;
  loggedInUser: any;
  productDetail: any = {};
  productId: string = "";
  isUserFavorite: boolean;
  memberSince: string;
  imagePath: string;
  noImagePath: string;
  imgSrc: string = null;
  nameInitials: string = "";
  currentImageIndex = 0;
  imageUrls = [];
  userFavorites = [];

  constructor(
    public localStorageService: LocalStorageService,
    public httpService: HttpService,
    public chatService: ChatService,
    public dateService: DateService,
    public openLoginDialogService: OpenLoginDialogService,
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    private snackBarService: SnackbarService,
    private loaderService: LoaderService
  ) {
    this.isUserFavorite = this.localStorageService.getItem("favorite");
  }

  ngOnInit(): void {
    this.route.params.subscribe(event => {
      this.productId = event.productId;
    });
    this.getProductDetails().then(() => {
      this.initializeProductValues().then(() => {
        this.getFavorite(this.loggedInUser["_id"], this.product._id);
        if (this.product["seller"]["profile_image_filename"]) {
          this.imgSrc = `http://localhost:3000/users/profileimage/${this.product["seller"]["profile_image_filename"]}`;
        } else {
          this.extractNameInitials();
        }
        this.handleImageUrls();
      });
    });
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
  }

  getFavorite(userId, productId) {
    let filter = {};
    filter["userId"] = userId;
    filter["productId"] = productId;
    this.loaderService.showLoader();
    this.httpService.getRequest(`favorites/getFavorite/`, { ...filter }).subscribe(
      res => {
        this.handleFavorite(res);
        this.loaderService.hideLoader();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.GET_USER_FAVORITES_ERROR, "error");
      }
    );
  }

  handleFavorite(res) {
    const userFavorite = res;
    if (userFavorite.length) {
      if (userFavorite[0].favorite) {
        this.isUserFavorite = true;
      } else {
        this.isUserFavorite = false;
      }
    }
  }

  extractNameInitials() {
    let name = this.product["seller"]["name"];
    let nameSplit = name.split(" ");
    nameSplit.forEach((name, index) => {
      index < 2 ? (this.nameInitials += name.charAt(0)) : null;
    });
  }

  get product() {
    return this.productDetail;
  }

  initializeProductValues() {
    return new Promise((resolve, reject) => {
      this.createdOn = this.dateService.handleCreatedOn(this.product["created_on"]);
      this.location = this.product["location"];
      this.memberSince = this.product["created_on"]
        ? moment(this.product["created_on"]).format("MMM YYYY")
        : moment().format("MMM YYYY");
      this.imagePath = `${environment.baseUrl}/products/productimage/${this.product?.photos[this.currentImageIndex]}`;
      this.noImagePath = staticVariables.noImagePath;
      resolve(true);
    });
  }

  addFavorite() {
    if (this.loggedInUser) {
      let body = {
        user: this.loggedInUser,
        product: this.product["_id"],
        favorite: !this.isUserFavorite
      };
      this.loaderService.showLoader();
      this.httpService.postRequest(`favorites`, body).subscribe(
        res => {
          this.isUserFavorite = !this.isUserFavorite;
          this.loaderService.hideLoader();
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.ADD_FAVORITES_ERROR, "error");
        }
      );
    } else {
      this.openLoginDialog();
    }
  }

  openLoginDialog(redirectTo?) {
    this.openLoginDialogService.openLoginDialog(redirectTo);
  }

  getProductDetails() {
    return new Promise((resolve, reject) => {
      this.loaderService.showLoader();
      this.httpService.getRequest(`products/${this.productId}`).subscribe(
        res => {
          this.productDetail = res;
          this.loaderService.hideLoader();
          resolve(res);
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.GET_PRODUCT_DETAILS_ERROR, "error");
          reject(err);
        }
      );
    });
  }

  chatWithSeller() {
    this.localStorageService.setItem("seller", this.product["seller"]);
    if (this.loggedInUser) {
      this.router.navigateByUrl(`chat/${this.product["seller"]["_id"]}`);
    } else {
      this.openLoginDialog(`chat/${this.product["seller"]["_id"]}`);
    }
  }

  handleImageUrls() {
    this.imageUrls = this.product.photos.map(fileName => {
      return `${environment.baseUrl}/products/productimage/${fileName}`;
    });
  }

  previousImage() {
    let index;
    if (this.currentImageIndex === 0) {
      index = this.imageUrls.length - 1;
    } else {
      index = this.currentImageIndex - 1;
    }
    this.currentImageIndex = index;
    this.imagePath = this.imageUrls[index];
  }

  nextImage() {
    let index;
    if (this.currentImageIndex === this.imageUrls.length - 1) {
      index = 0;
    } else {
      index = this.currentImageIndex + 1;
    }
    this.currentImageIndex = index;
    this.imagePath = this.imageUrls[index];
  }

  selectImage(imageUrl) {
    this.imagePath = imageUrl;
    this.currentImageIndex = this.imageUrls.indexOf(imageUrl);
  }
}
