import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ChatService } from "../utils/service/chat/chat.service";
import { LoaderService } from "../utils/service/loader/loader.service";
import { HttpService } from "../utils/service/http/http.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit {
  selectedRoom: any = null;
  messages: any = [];
  loggedInUser: any = null;
  sendButtonDisabled: Boolean = true;
  inputMessage = "";
  sellerRooms: any = [];
  buyerRooms: any = [];
  staticSellerRooms: any = [];
  staticBuyerRooms: any = [];
  messageForm = new FormGroup({});
  searchRoomForm = new FormGroup({});
  seller = null;
  roomExistsAsBuyer: Boolean = false;
  searchBarOpen: Boolean = false;
  socketRoomName: String;
  selectedTabIndex = 0;
  productId: string;

  constructor(
    public localStorageService: LocalStorageService,
    public formBuilder: FormBuilder,
    public chatService: ChatService,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private snackBarService: SnackbarService
  ) {
    this.messageForm = formBuilder.group({
      Message: [""]
    });
    this.searchRoomForm = formBuilder.group({
      Room: [""]
    });
  }

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.seller = this.localStorageService.getItem("seller");
    this.productId = this.localStorageService.getItem("productId");
    this.localStorageService.removeItem("seller");
    this.localStorageService.removeItem("productId");
    this.chatService.getMyRoomsAsBuyer(this.loggedInUser._id).subscribe(async rooms => {
      let newRooms = await this.appendRoomName(rooms);
      this.staticBuyerRooms = newRooms;
      this.buyerRooms = this.staticBuyerRooms;
      if (!this.roomExistsAsBuyer && this.seller && this.productId) {
        this.chatService.createRoom(this.seller._id, this.loggedInUser._id, this.productId);
        window.location.reload();
      }
      this.chatService.getMyRoomsAsSeller(this.loggedInUser._id).subscribe(async rooms => {
        let newRooms = await this.appendRoomName(rooms);
        this.staticSellerRooms = newRooms;
        this.sellerRooms = this.staticSellerRooms;
      });
    });
  }

  sendMessage() {
    const message = this.messageForm.get("Message").value;
    if (message) {
      let roomId = this.selectedRoom._id;
      let roomName = this.selectedRoom.name;
      this.chatService.sendMessage(message, roomId, roomName);
      // clear the input after the message is sent
      this.messageForm.reset();
    }
  }

  inputEventListener(event) {
    var message = event.target.value;
    if (message === "") {
      this.sendButtonDisabled = true;
    } else {
      this.sendButtonDisabled = false;
    }
  }

  filterRooms(event) {
    let searchData = event.target.value;
    this.sellerRooms = this.staticSellerRooms.filter(room =>
      room["name"].toLowerCase().includes(searchData.toLowerCase())
    );
  }

  selectRoom(room) {
    // Select room and get the chat messages
    this.chatService.getChatForRoom(room._id).subscribe(data => {
      this.messages = data["messages"];
      this.selectedRoom = room;
    });
  }

  appendRoomName(rooms) {
    let newRooms = rooms.map(room => {
      if (room.buyer_id === this.loggedInUser._id) {
        this.roomExistsAsBuyer = true;
        this.selectRoom(room);
        this.getUserDetails(room.seller_id).then(res => {
          room.name = res["name"];
          this.socketRoomName = room.name;
        });
      }
      if (room.seller_id === this.loggedInUser._id) {
        this.getUserDetails(room.buyer_id).then(res => {
          room.name = res["name"];
          this.socketRoomName = room.name;
          this.selectRoom(room);
        });
      }
      return room;
    });
    return Promise.resolve(newRooms);
  }

  getUserDetails(userId) {
    return new Promise((resolve, reject) => {
      let filter = {};
      filter["userId"] = userId;
      this.loaderService.showLoader();
      this.httpService.getRequest(`users/getDetails`, { ...filter }).subscribe(
        res => {
          this.loaderService.hideLoader();
          resolve(res);
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.GET_USER_FAVORITES_ERROR, "error");
          reject(err);
        }
      );
    });
  }

  toggleSearchBar() {
    this.searchBarOpen = !this.searchBarOpen;
  }

  onTabChange(event) {
    this.selectedTabIndex = event.index;
  }
}
