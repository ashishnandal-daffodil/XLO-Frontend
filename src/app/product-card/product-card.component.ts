import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";
import { HttpService } from "src/app/utils/service/http/http.service";
import { LocalStorageService } from "src/app/utils/service/localStorage/local.service";
import { Router } from "@angular/router";
import { DateService } from "../utils/service/date/date.service";
import { staticVariables } from "../utils/helpers/static-variables";
import { LoginComponent } from "../login/login.component";
import { MatDialog } from "@angular/material/dialog";
import { OpenLoginDialogService } from "../utils/service/openLoginDialog/open-login-dialog.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { LoaderService } from "../utils/service/loader/loader.service";
@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.css"]
})
export class ProductCardComponent {
  constructor(
    public httpService: HttpService,
    public localStorageService: LocalStorageService,
    public router: Router,
    public dateService: DateService,
    public openLoginDialogService: OpenLoginDialogService,
    public dialog: MatDialog,
    private snackBarService: SnackbarService,
    private loaderService: LoaderService
  ) {}

  createdOn: String;
  city: String;
  state: String;
  loggedInUser: object;
  productDetail: any = {};
  thumbnailPath: string;
  noThumbnailImagePath: string;

  @Input() set productDetails(product) {
    this.productDetail = product;
  }

  get product() {
    return this.productDetail;
  }

  ngOnInit() {
    this.initializeProductValues();
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
  }

  initializeProductValues() {
    this.createdOn = this.dateService.handleCreatedOn(this.product.created_on);
    this.city = this.product?.location?.city ? this.product.location.city : "Demo City";
    this.state = this.product?.location?.state ? this.product?.location.state : "Demo State";
    this.thumbnailPath = this.product?.photos[0];
    this.noThumbnailImagePath = staticVariables.noImagePath;
  }

  ngOnChanges(): void {
    this.initializeProductValues();
  }

  onClick() {
    this.localStorageService.setItem("favorite", this.product.isUserFavorite);
    this.router.navigateByUrl(`productDetails/${this.product["_id"]}`);
  }

  openLoginDialog() {
    this.openLoginDialogService.openLoginDialog();
  }

  addFavorite(event) {
    event.stopPropagation();
    if (this.loggedInUser) {
      let body = {
        user: this.loggedInUser,
        product: this.product._id,
        favorite: !this.product.isUserFavorite
      };
      this.loaderService.showLoader();
      this.httpService.postRequest(`favorites`, body).subscribe(
        res => {
          this.product.isUserFavorite = !this.product.isUserFavorite;
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
}
