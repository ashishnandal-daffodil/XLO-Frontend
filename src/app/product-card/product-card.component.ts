import { Component, OnInit, Input, Output } from "@angular/core";
import * as moment from "moment";
import { HttpService } from "src/app/utils/service/http.service";
import { LocalStorageService } from "src/app/utils/service/local.service";

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.css"]
})
export class ProductCardComponent implements OnInit {
  
  constructor(public httpService: HttpService, public localStorageService: LocalStorageService) {}
  
  createdOn: String;
  city: String;
  state: String;
  loggedInUser: object;
  productDetail: any = {};
  
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
    this.createdOn = moment(this.product.created_on).format("MMM DD");
    this.city = this.product?.location?.city ? this.product.location.city : "Demo City";
    this.state = this.product?.location?.state ? this.product?.location.state : "Demo State";
  }

  ngOnChanges(): void{
    this.initializeProductValues();
  }

  onClick(event) {
    console.log("🚀 ~ file: product-card.component.ts ~ line 36 ~ ProductCardComponent ~ onClick ~ event", event)
  }

  addFavorite() {
    let body = {
      user: this.loggedInUser,
      product: this.product._id,
      favorite: !this.product.isUserFavorite
    };
    this.httpService.postRequest(`favorites`, body).subscribe(
      res => {
        this.product.isUserFavorite = !this.product.isUserFavorite;
      },
      err => {
        console.log(err);
      }
    );
  }
}
