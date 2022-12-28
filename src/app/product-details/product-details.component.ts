import { Component, OnInit, Input } from "@angular/core";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import _ from "lodash";
import * as moment from "moment";
import { HttpService } from "../utils/service/http/http.service";
import { ActivatedRoute, Router } from "@angular/router";
import { staticVariables } from "../utils/helpers/static-variables";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "../login/login.component";
import { ChatService } from "../utils/service/chat/chat.service";
import { OpenLoginDialogService } from "../utils/service/openLoginDialog/open-login-dialog.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { LoaderService } from "../utils/service/loader/loader.service";
import { environment } from "src/environments/environment";
import { CommonAPIService } from "../utils/commonAPI/common-api.service";
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
  sellerDetails: any;
  chatButtonDisabled: boolean = false;
  productSellerName: string = "";

  constructor(
    public localStorageService: LocalStorageService,
    public httpService: HttpService,
    public chatService: ChatService,
    public openLoginDialogService: OpenLoginDialogService,
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    private snackBarService: SnackbarService,
    private loaderService: LoaderService,
    private commonAPIService: CommonAPIService
  ) {
    this.isUserFavorite = this.localStorageService.getItem("favorite");
  }

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.route.params.subscribe(event => {
      this.productId = event.productId;
    });
    this.commonAPIService.getProductDetails(this.productId).subscribe(productDetails => {
      this.productDetail = productDetails;
      this.initializeProductValues().then(() => {
        if (this.loggedInUser) {
          if (this.loggedInUser._id == this.product["seller"]) {
            this.chatButtonDisabled = true;
          } else {
            this.chatButtonDisabled = false;
          }
          this.getFavorite(this.loggedInUser["_id"], this.product._id);
        }
        this.commonAPIService.getUserDetails(this.product["seller"]).subscribe(sellerDetails => {
          if (sellerDetails) {
            this.sellerDetails = sellerDetails;
            this.memberSince = this.sellerDetails.created_on;
            this.productSellerName = this.sellerDetails.name;
            if (this.sellerDetails?.profile_image_filename) {
              this.imgSrc = `${environment.baseUrl}/users/profileimage/${this.sellerDetails.profile_image_filename}`;
            }
          }
        });
        this.handleImageUrls();
      });
    });
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
        this.snackBarService.open(errorMessages.FETCH_DATA_ERROR, "error");
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

  get product() {
    return this.productDetail;
  }

  initializeProductValues() {
    return new Promise((resolve, reject) => {
      this.location = this.product["location"];
      this.noImagePath = staticVariables.noImagePath;
      if (this.product.photos.length) {
        this.imagePath = `${environment.baseUrl}/products/productimage/${this.product?.photos[this.currentImageIndex]}`;
      }
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
          this.snackBarService.open(errorMessages.INSERT_DATA_ERROR, "error");
        }
      );
    } else {
      this.openLoginDialog();
    }
  }

  openLoginDialog(redirectTo?) {
    this.openLoginDialogService.openLoginDialog(redirectTo);
  }

  chatWithSeller() {
    this.localStorageService.setItem("seller", this.product.seller);
    this.localStorageService.setItem("productId", this.product._id);
    if (this.loggedInUser) {
      this.router.navigateByUrl(`chat/${this.loggedInUser._id}`);
    } else {
      this.openLoginDialog(`chat`);
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
