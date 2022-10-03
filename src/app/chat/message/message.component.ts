import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/utils/service/local.service';
import * as moment from 'moment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  loggedInUser = null;
  messageTime: string;
  @Input() message;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem('loggedInUser');
    this.messageTime = moment(this.message.created_on).format("HH:MM")
  }

}
