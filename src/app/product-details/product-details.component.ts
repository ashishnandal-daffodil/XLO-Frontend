import { Component, OnInit, Input } from "@angular/core";
import { LocalStorageService } from "../utils/service/local.service";
import _ from "lodash";
import * as moment from "moment";
import { HttpService } from "../utils/service/http.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DateService } from "../utils/service/date.service";
import { staticVariables } from "../utils/helpers/static-variables";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "../login/login.component";
import { ChatService } from "../utils/service/chat.service";
import { OpenLoginDialogService } from "../utils/service/open-login-dialog.service";
import { MatSnackBar } from "@angular/material/snack-bar";

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
    private snackBar: MatSnackBar
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
      this.httpService.postRequest(`favorites`, body).subscribe(
        res => {
          this.isUserFavorite = !this.isUserFavorite;
        },
        err => {
          this.snackBar.open(err, "", {
            panelClass: ["mat-snack-bar-error"]
          });
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
      this.httpService.getRequest(`products/${this.productId}`).subscribe(
        res => {
          this.productDetail = res;
          resolve(res);
        },
        err => {
          this.snackBar.open(err, "", {
            panelClass: ["mat-snack-bar-error"]
          });
          reject(err);
        }
      );
    });
  }

  chatWithSeller() {
    // this.chatService.createRoom(this.product["seller"]);
    this.localStorageService.setItem("seller", this.product["seller"]);
    if (this.loggedInUser) {
      this.router.navigateByUrl(`chat/${this.product["seller"]["_id"]}`);
    } else {
      this.openLoginDialog(`chat/${this.product["seller"]["_id"]}`);
    }
  }
}
