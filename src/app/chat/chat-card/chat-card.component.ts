import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { CommonAPIService } from "src/app/utils/commonAPI/common-api.service";
import { LocalStorageService } from "src/app/utils/service/localStorage/local.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-chat-card",
  templateUrl: "./chat-card.component.html",
  styleUrls: ["./chat-card.component.css"]
})
export class ChatCardComponent implements OnInit {
  latestMessageTime: String;
  @Input() roomCard;
  @Input() selectedRoom;
  @Input() latest_message;
  @Input() latest_message_time;
  @Input() unreadMessageCount;
  roomCardInitialsString: string = "";
  imgSrc: string = null;
  productId: string = "";
  productDetails: any = {};
  isSelectedRoom: boolean = false;
  loggedInUser: any = {};

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private commonAPIService: CommonAPIService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.productId = this.roomCard.product_id;
    this.commonAPIService.getProductDetails(this.productId).subscribe(productDetails => {
      this.productDetails = productDetails;
      if (this.productDetails.photos.length) {
        this.roomCard.profile_image_filename = this.productDetails.photos[0];
        this.imgSrc = `${environment.baseUrl}/products/productimage/${this.productDetails.photos[0]}`;
      }
    });

    //If loggedInUser is a buyer, then append seller name to room name
    if (this.loggedInUser._id == this.roomCard.buyer_id) {
      this.commonAPIService.getUserDetails(this.roomCard.seller_id).subscribe(userDetails => {
        this.roomCard.userName = userDetails["name"];
        this.roomCardInitialsString = this.roomCard.name.split("-")[0];
      });
    }

    //If loggedInUser is a seller, then append buyer name to room name
    if (this.loggedInUser._id == this.roomCard.seller_id) {
      this.commonAPIService.getUserDetails(this.roomCard.buyer_id).subscribe(userDetails => {
        this.roomCard.userName = userDetails["name"];
        this.roomCardInitialsString = this.roomCard.name.split("-")[0];
      });
    }
  }

  ngAfterViewInit(): void {}

  ngOnChanges(): void {
    if (this.roomCard._id == this.selectedRoom._id) {
      this.isSelectedRoom = true;
    } else {
      this.isSelectedRoom = false;
    }
  }
}
