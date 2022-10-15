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
@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"]
})
export class ProductDetailsComponent {
  createdOn: String;
  city: String;
  state: String;
  loggedInUser: object;
  productDetail: object = {};
  productId: string = "";
  isUserFavorite: boolean;
  memberSince: string;
  imagePath: string;
  noImagePath: string;

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
      this.initializeProductValues();
    });
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
  }

  get product() {
    return this.productDetail;
  }

  initializeProductValues() {
    this.createdOn = this.dateService.handleCreatedOn(this.product["created_on"]);
    this.city =
      this.product["location"] && this.product["location"]["city"] ? this.product["location"]["city"] : "Demo City";
    this.state =
      this.product["location"] && this.product["location"]["state"] ? this.product["location"]["state"] : "Demo State";
    this.memberSince = this.product["created_on"]
      ? moment(this.product["created_on"]).format("MMM YYYY")
      : moment().format("MMM YYYY");
    this.imagePath = this.product["photos"][0];
    this.noImagePath = staticVariables.noImagePath;
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
}
