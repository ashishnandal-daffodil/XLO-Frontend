import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ChatService } from "../utils/service/chat/chat.service";
import { LoaderService } from "../utils/service/loader/loader.service";
import { HttpService } from "../utils/service/http/http.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { CommonAPIService } from "../utils/commonAPI/common-api.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit {
  selectedRoom: any = false;
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
  selectedTabIndex = 0;
  productId: string;
  isReceiverTyping: boolean = false;
  isReceiverTypingTimeoutID = null;
  isReceiverOnline = false;
  onlineUsers = null;
  userOnline = false;
  productDetail: any = {};
  imgSrc: string = null;
  nameInitials: string = "";
  selectedRoomUserName: string = "";
  selectedRoomProfileImagePath: string = "";
  selectedRoomId: string;

  @ViewChild("chat") private chatContainer: ElementRef;

  constructor(
    public localStorageService: LocalStorageService,
    public formBuilder: FormBuilder,
    public chatService: ChatService,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private snackBarService: SnackbarService,
    private router: Router,
    private commonAPIService: CommonAPIService
  ) {
    this.messageForm = formBuilder.group({
      Message: [""]
    });
    this.searchRoomForm = formBuilder.group({
      Room: [""]
    });
  }

  ngOnInit(): void {
    //Get localStorageData
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.seller = this.localStorageService.getItem("seller");
    this.productId = this.localStorageService.getItem("productId");
    this.selectedRoomId = this.localStorageService.getItem("selectedRoomId");

    //Subscribe to Socket Events
    this.subscribeToSocketEvents();

    //Remove all message notifications of the logged in user
    this.removeMessageNotifications();

    if (this.productId) {
      this.commonAPIService.getProductDetails(this.productId).then(productDetails => {
        this.productDetail = productDetails;
        this.initialiseRooms();
      });
    } else {
      this.initialiseRooms();
    }
    this.localStorageService.removeItem("seller");
    this.localStorageService.removeItem("productId");
  }

  ngAfterViewChecked(): void {
    this.scrollChatToBottom();
  }

  ngAfterViewInit(): void {
    if (this.loggedInUser?.profile_image_filename) {
      this.imgSrc = `${environment.baseUrl}/users/profileimage/${this.loggedInUser.profile_image_filename}`;
    }
  }

  initialiseRooms() {
    this.chatService.getMyRoomsAsBuyer(this.loggedInUser._id).subscribe(async rooms => {
      let newRooms = await this.handleRooms(rooms);
      this.staticBuyerRooms = newRooms;
      this.buyerRooms = this.staticBuyerRooms;
      if (!this.roomExistsAsBuyer && this.seller && this.productId) {
        this.chatService.createRoom(this.seller, this.loggedInUser._id, this.productId, this.productDetail.title);
      }
      this.chatService.getMyRoomsAsSeller(this.loggedInUser._id).subscribe(async rooms => {
        let newRooms = await this.handleRooms(rooms);
        this.staticSellerRooms = newRooms;
        this.sellerRooms = this.staticSellerRooms;
        //get all online users
        this.chatService.getAllConnectedUsers().subscribe(onlineUsers => {
          this.setOnlineUsers(onlineUsers);
        });
      });
    });
  }

  subscribeToSocketEvents() {
    //subscribe to onCreateRoom event
    this.chatService.onCreateRoom().subscribe(room => {
      this.appendRoom(room);
    });

    //subscribe to message event
    this.chatService.getMessage().subscribe(res => {
      if (this.selectedRoom._id == res["roomId"]) {
        this.messages.push(res["latest_message"]);
      }
      this.appendLatestMessageToRoom(res["latest_message"], res["roomId"]);
      this.scrollChatToBottom();
    });

    //subscribe to isTyping event
    this.chatService.isReceiverTyping().subscribe(res => {
      if (this.selectedRoom._id === res["roomId"]) {
        if (this.isReceiverTypingTimeoutID) {
          clearTimeout(this.isReceiverTypingTimeoutID);
        }
        this.isReceiverTyping = true;
        this.isReceiverTypingTimeoutID = setTimeout(() => {
          this.isReceiverTyping = false;
        }, 1500);
      }
    });

    //subscribe to isOnline event
    this.chatService.isReceiverOnline().subscribe(onlineUsers => {
      this.setOnlineUsers(onlineUsers);
    });

    //subscribe to isOffline event
    this.chatService.isReceiverOffline().subscribe(socketId => {
      this.removeOnlineUser(socketId);
    });
  }

  removeMessageNotifications() {
    return new Promise((resolve, reject) => {
      let filter = {};
      filter["userId"] = this.loggedInUser._id;
      this.loaderService.showLoader();
      this.httpService.putRequest(`notifications/removeMessageNotifications`, { ...filter }).subscribe(
        res => {
          this.loaderService.hideLoader();
          resolve(res);
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.REMOVE_DATA_ERROR, "error");
          reject(err);
        }
      );
    });
  }

  appendRoom(room) {
    if (this.loggedInUser._id == room.buyer_id) {
      room.unread_messages.map(userData => {
        if (userData.userId == room.buyer_id) {
          room.unreadMessageCount = userData.count;
        }
      });
      this.buyerRooms.push(room);
      this.selectedTabIndex = 1;
      this.handleRooms(this.buyerRooms);
    }
    if (this.loggedInUser._id == room.seller_id) {
      room.unread_messages.map(userData => {
        if (userData.userId == room.seller_id) {
          room.unreadMessageCount = userData.count;
        }
      });
      this.sellerRooms.push(room);
      this.selectedTabIndex = 0;
      this.handleRooms(this.sellerRooms);
    }
  }

  removeOnlineUser(socketId) {
    this.buyerRooms.map(room => {
      this.onlineUsers.map(user => {
        if (user.user_id !== this.loggedInUser._id) {
          if (user.socket_id === socketId && user.user_id === room.seller_id) {
            room.isReceiverOnline = false;
          }
        }
      });
    });

    this.sellerRooms.map(room => {
      room.userRole = "seller";
      this.onlineUsers.map(user => {
        if (user.user_id !== this.loggedInUser._id) {
          if (user.socket_id === socketId && user.user_id === room.buyer_id) {
            room.isReceiverOnline = false;
          }
        }
      });
    });

    if (this.selectedRoom) {
      this.setSelectedRoom();
    }
  }

  setOnlineUsers(onlineUsers) {
    this.onlineUsers = onlineUsers;

    this.buyerRooms.map(room => {
      room.userRole = "buyer";
      this.onlineUsers.map(user => {
        if (user.user_id !== this.loggedInUser._id) {
          if (user.user_id === room.seller_id) {
            room.isReceiverOnline = true;
          }
        }
      });
    });

    this.sellerRooms.map(room => {
      room.userRole = "seller";
      this.onlineUsers.map(user => {
        if (user.user_id !== this.loggedInUser._id) {
          if (user.user_id === room.buyer_id) {
            room.isReceiverOnline = true;
          }
        }
      });
    });

    if (this.selectedRoom) {
      this.setSelectedRoom();
    }
  }

  setSelectedRoom() {
    this.buyerRooms.map(room => {
      if (room._id === this.selectedRoom._id) {
        this.selectRoom(room);
      }
    });
    this.sellerRooms.map(room => {
      if (room._id === this.selectedRoom._id) {
        this.selectRoom(room);
      }
    });
  }

  sendMessage() {
    const message = this.messageForm.get("Message").value;
    if (message) {
      let roomId = this.selectedRoom._id;
      this.chatService.sendMessage(message, roomId);
      // clear the input after the message is sent
      this.messageForm.reset();
    }
  }

  appendLatestMessageToRoom(latest_message, roomId) {
    this.sellerRooms.map(room => {
      if (room._id === roomId) {
        room.latest_message = latest_message;
        if (room._id !== this.selectedRoom._id) {
          room.unreadMessageCount += 1;
          this.updateUnreadMessageCountInDB(roomId, room.seller_id, false);
        }
      }
    });
    this.buyerRooms.map(room => {
      if (room._id === roomId) {
        room.latest_message = latest_message;
        if (room._id !== this.selectedRoom._id) {
          room.unreadMessageCount += 1;
        }
      }
    });
  }

  scrollChatToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  inputEventListener(event) {
    var message = event.target.value;
    this.chatService.isTyping(this.loggedInUser._id, this.selectedRoom._id);
    if (message === "") {
      this.sendButtonDisabled = true;
    } else {
      this.sendButtonDisabled = false;
    }
  }

  filterRooms(event) {
    let searchData = event.target.value;
    if (this.selectedTabIndex == 0) {
      this.sellerRooms = this.staticSellerRooms.filter(room => {
        return (
          room["name"].toLowerCase().includes(searchData.toLowerCase()) ||
          room["userName"].toLowerCase().includes(searchData.toLowerCase())
        );
      });
    } else {
      this.selectedTabIndex = 1;
      this.buyerRooms = this.staticBuyerRooms.filter(room => {
        return (
          room["name"].toLowerCase().includes(searchData.toLowerCase()) ||
          room["userName"].toLowerCase().includes(searchData.toLowerCase())
        );
      });
    }
  }

  selectRoom(room) {
    //Set selected room in local storage
    this.localStorageService.setItem("selectedRoomId", room._id);
    this.searchBarOpen = false;
    // Select room and get the chat messages
    this.selectedRoomUserName = room.userName;
    this.commonAPIService.getProductDetails(room.product_id).then(productDetails => {
      if (productDetails["photos"]["length"]) {
        room.profile_image_filename = productDetails["photos"][0];
        this.selectedRoomProfileImagePath = `${environment.baseUrl}/products/productimage/${room.profile_image_filename}`;
      }
    });
    this.chatService.getChatForRoom(room._id).subscribe(async data => {
      this.messages = data["messages"];
      let updatedRoom = await this.resetUnreadMessageCount(room._id);
      this.selectedRoom = updatedRoom;
    });
  }

  resetUnreadMessageCount(roomId) {
    return new Promise((resolve, reject) => {
      let updatedRoom = null;
      this.sellerRooms.map(room => {
        if (room._id === roomId) {
          room.unreadMessageCount = 0;
          updatedRoom = room;
          this.updateUnreadMessageCountInDB(roomId, room.seller_id, true);
        }
      });
      this.buyerRooms.map(room => {
        if (room._id === roomId) {
          room.unreadMessageCount = 0;
          updatedRoom = room;
          this.updateUnreadMessageCountInDB(roomId, room.buyer_id, true);
        }
      });
      if (updatedRoom) {
        resolve(updatedRoom);
      } else {
        reject("No room found!!!");
      }
    });
  }

  updateUnreadMessageCountInDB(roomId, userId, resetCount) {
    let body = {
      roomId: roomId,
      userId: userId,
      resetCount: resetCount
    };
    this.loaderService.showLoader();
    this.httpService.putRequest(`room/updateUnreadMessageCount`, body).subscribe(
      res => {
        this.loaderService.hideLoader();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.UPDATE_FAILED_ERROR, "error");
      }
    );
  }

  handleRooms(rooms) {
    let newRooms = rooms.map(room => {
      if (room.buyer_id === this.loggedInUser._id) {
        room.unread_messages.map(userData => {
          if (userData.userId == room.buyer_id) {
            room.unreadMessageCount = userData.count;
          }
        });
        if (room.product_id === this.productId) {
          this.roomExistsAsBuyer = true;
          this.selectedTabIndex = 1;
          this.selectRoom(room);
        }
        if (this.selectedRoomId && room._id === this.selectedRoomId) {
          this.selectedTabIndex = 1;
          this.selectRoom(room);
        }
      }
      if (room.seller_id === this.loggedInUser._id) {
        room.unread_messages.map(userData => {
          if (userData.userId == room.seller_id) {
            room.unreadMessageCount = userData.count;
          }
        });
        if (room.product_id === this.productId) {
          this.selectedTabIndex = 0;
          this.selectRoom(room);
        }
        if (this.selectedRoomId && room._id === this.selectedRoomId) {
          this.selectedTabIndex = 0;
          this.selectRoom(room);
        }
      }
      return room;
    });
    return Promise.resolve(newRooms);
  }

  toggleSearchBar() {
    this.searchBarOpen = !this.searchBarOpen;
  }

  onTabChange(event) {
    this.selectedTabIndex = event.index;
  }

  redirectToUserProfile() {
    this.localStorageService.setItem("userProfileSelectedTabIndex", 1);
    this.router.navigateByUrl(`/userProfile/${this.loggedInUser._id}`);
  }

  ngOnDestroy(): void {
    this.localStorageService.removeItem("selectedRoomId")
  }
}
