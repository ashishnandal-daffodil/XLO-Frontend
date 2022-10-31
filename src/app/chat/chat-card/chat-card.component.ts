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

  constructor() {}

  ngOnInit(): void {
    this.latestMessageTime = this.roomCard?.latest_message?.created_on;
  }
}
