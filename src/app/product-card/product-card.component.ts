import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";
import { HttpService } from "src/app/utils/service/http/http.service";
import { LocalStorageService } from "src/app/utils/service/localStorage/local.service";
import { Router } from "@angular/router";
import { staticVariables } from "../utils/helpers/static-variables";
import { LoginComponent } from "../login/login.component";
import { MatDialog } from "@angular/material/dialog";
import { OpenLoginDialogService } from "../utils/service/openLoginDialog/open-login-dialog.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { LoaderService } from "../utils/service/loader/loader.service";
import { environment } from "src/environments/environment";
import { DeleteConfirmationDialogComponent } from "./delete-confirmation-dialog/delete-confirmation-dialog.component";
import { successMessages } from "../utils/helpers/success-messages";
import { RepostConfirmationDialogComponent } from "./repost-confirmation-dialog/repost-confirmation-dialog.component";
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
    public openLoginDialogService: OpenLoginDialogService,
    public dialog: MatDialog,
    private snackBarService: SnackbarService,
    private loaderService: LoaderService
  ) {}

  createdOn: String;
  loggedInUser: any;
  productDetail: any = {};
  thumbnailPath: string = null;
  noThumbnailImagePath: string;
  myAdsOpen: boolean = false;
  isActive: boolean;

  @Input() set productDetails(product) {
    this.productDetail = product;
  }

  get product() {
    return this.productDetail;
  }

  ngOnInit() {
    this.myAdsOpen = this.router.url.includes("userProfile");
    this.initializeProductValues();
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    if (this.product.active) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

  initializeProductValues() {
    this.noThumbnailImagePath = staticVariables.noImagePath;
    if (this.product.photos.length) {
      this.thumbnailPath = `${environment.baseUrl}/products/productimage/${this.product?.photos[0]}`;
    }
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

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
    dialogRef.componentInstance.isActive = this.isActive;
    dialogRef.afterClosed().subscribe(action => {
      if (action) {
        if (action === "cancel") {
          // do nothing
          return;
        } else {
          return this.delete(action);
        }
      } else {
        return;
      }
    });
  }

  openRepostDialog(): void {
    const dialogRef = this.dialog.open(RepostConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(action => {
      if (action) {
        if (action === "no") {
          // do nothing
          return;
        } else {
          return this.repost();
        }
      } else {
        return;
      }
    });
  }

  delete(action) {
    let body = {
      productId: this.product._id
    };
    if (action === "permanently") {
      body["productImages"] = this.product.photos;
    }
    this.loaderService.showLoader();
    this.httpService.putRequest(`products/delete`, body).subscribe(
      res => {
        this.loaderService.hideLoader();
        window.location.reload();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.ADD_FAVORITES_ERROR, "error");
      }
    );
  }

  repost() {
    let formData = new FormData();
    let changes = {
      active: "true"
    };
    formData.append("productId", this.product._id);
    formData.append("changes", JSON.stringify(changes));
    this.loaderService.showLoader();
    this.httpService.putRequest(`products/update`, formData).subscribe(
      res => {
        this.loaderService.hideLoader();
        this.snackBarService.open(successMessages.PRODUCT_UPDATED_SUCCESSFULLY, "success");
        window.location.reload();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.UPDATE_FAILED_ERROR, "error");
      }
    );
  }

  deleteAd(event) {
    event.stopPropagation();
    this.openDeleteDialog();
  }

  rePostAd(event) {
    event.stopPropagation();
    this.openRepostDialog();
  }

  editProduct() {
    this.router.navigate(["/editAdd"], { queryParams: { productId: this.product._id } });
  }
}
