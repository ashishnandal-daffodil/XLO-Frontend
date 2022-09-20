import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../utils/service/local.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import * as moment from "moment";
import { ChatService } from "../utils/service/chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit {
  chats = [
    { username: "Faryl", latestMessage: "Hi" },
    { username: "Akash", latestMessage: "Hello" }
  ];
  messages = [
    { message: "Hi", sender: "Faryl" },
    { message: "How are you?", sender: "Faryl" },
    { message: "Hello", sender: "Akash" },
    { message: "I am in Hisar", sender: "Faryl" },
    { message: "I am fine. How are you?", sender: "Akash" },
    { message: "Can we meet?", sender: "Faryl" }
  ];
  loggedInUser = null;
  sendButtonDisabled: Boolean = true;
  inputMessage = "";

  CHAT_ROOM = "myRandomChatRoomId";

  messageForm = new FormGroup({});

  constructor(
    public localStorageService: LocalStorageService,
    public formBuilder: FormBuilder,
    public chatService: ChatService
  ) {
    this.messageForm = formBuilder.group({
      Message: [""]
    });
  }

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.setSocketConnection();
  }

  setSocketConnection() {
    this.chatService.setupSocketConnection();
    this.chatService.subscribeToMessages((err, data) => {
      console.log("NEW MESSAGE ", data);
      this.messages = [...this.messages, data];
    });
  }

  sendMessage() {
    const message = this.messageForm.get("Message").value;
    if (message) {
      this.chatService.sendMessage({ message: message, roomName: this.CHAT_ROOM }, cb => {
        console.log("ACKNOWLEDGEMENT ", cb);
      });
      this.messages.push({
        message: message,
        sender: this.loggedInUser ? this.loggedInUser.name : null
      });
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

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
