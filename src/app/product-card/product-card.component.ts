import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";
import { HttpService } from "src/app/utils/service/http.service";
import { LocalStorageService } from "src/app/utils/service/local.service";

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.css"]
})
export class ProductCardComponent implements OnInit {
  @Input("product") product: any = {};

  isUserFavorite: boolean = false;

  constructor(public httpService: HttpService, public localStorageService: LocalStorageService) {}

  createdOn: String;
  city: String;
  state: String;
  loggedInUser: object;

  ngOnInit() {
    this.initializeProductValues();
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
  }

  initializeProductValues() {
    this.createdOn = moment(this.product.created_on).format("MMM DD");
    this.city = this.product?.location?.city ? this.product.location.city : "Demo City";
    this.state = this.product?.location?.state ? this.product?.location.state : "Demo State";
  }

  onClick(event) {
    console.log("🚀 ~ file: product-card.component.ts ~ line 18 ~ ProductCardComponent ~ onClick ~ event", event);
  }

  addFavorite() {
    let body = {
      user: this.loggedInUser,
      product: this.product._id,
      favorite: !this.isUserFavorite
    };
    this.httpService.postRequest(`favorites`, body).subscribe(
      res => {
        console.log("🚀 ~ file: product-card.component.ts ~ line 40 ~ ProductCardComponent ~ addFavorite ~ res", res);
        this.isUserFavorite = !this.isUserFavorite;
      },
      err => {
        console.log("Something went wrong", "Error");
      }
    );
  }
}
