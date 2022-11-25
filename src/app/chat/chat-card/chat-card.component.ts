import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";

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
  isSelectedRoom: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.roomCard._id == this.selectedRoom._id) {
      this.isSelectedRoom = true;
    } else {
      this.isSelectedRoom = false;
    }
  }
}
