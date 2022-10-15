import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import * as moment from "moment";
import { ChatService } from "../utils/service/chat/chat.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit {
  selectedRoom: any = null;
  messages: any = [];
  loggedInUser = null;
  sendButtonDisabled: Boolean = true;
  inputMessage = "";
  rooms: any = [];
  staticRooms: any = [];
  messageForm = new FormGroup({});
  searchRoomForm = new FormGroup({});
  seller = null;
  roomExists: Boolean = false;
  searchBarOpen: Boolean = false;

  constructor(
    public localStorageService: LocalStorageService,
    public formBuilder: FormBuilder,
    public chatService: ChatService
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
    this.chatService.getMyRooms(this.loggedInUser._id).subscribe(rooms => {
      this.staticRooms = this.appendRoomName(rooms);
      this.rooms = this.staticRooms;
      if (!this.roomExists) {
        this.chatService.createRoom(this.seller);
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
    this.rooms = this.staticRooms.filter(room => room["name"].toLowerCase().includes(searchData.toLowerCase()));
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
      room.users.forEach(user => {
        if (user?.name != this.loggedInUser.name) {
          room.name = user.name;
        }
        if (user?.name == this.seller.name) {
          this.roomExists = true;
          this.selectRoom(room);
        }
      });
      return room;
    });
    return newRooms;
  }

  toggleSearchBar() {
    this.searchBarOpen = !this.searchBarOpen;
  }

  ngOnDestroy(): void {}
}
