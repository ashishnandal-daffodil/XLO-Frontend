import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { errorMessages } from "../utils/helpers/error-messages";
import { ChatService } from "../utils/service/chat/chat.service";
import { HttpService } from "../utils/service/http/http.service";
import { LoaderService } from "../utils/service/loader/loader.service";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";

@Component({
  selector: "app-notification-dialog",
  templateUrl: "./notification-dialog.component.html",
  styleUrls: ["./notification-dialog.component.css"]
})
export class NotificationDialogComponent implements OnInit {
  notifications = [];
  loggedInUser: any = {};

  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    private localStorageService: LocalStorageService,
    private chatService: ChatService,
    private router: Router,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.getMyNotifications().then(notifications => {
      if (notifications[0]) {
        this.handleNotifications(notifications[0].notifications);
      }
    });
    this.subscribeToSocketEvents();
  }

  getMyNotifications() {
    return new Promise((resolve, reject) => {
      let filter = {};
      filter["userId"] = this.loggedInUser._id;
      this.loaderService.showLoader();
      this.httpService.getRequest(`notifications/myNotifications`, { ...filter }).subscribe(
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

  subscribeToSocketEvents() {
    //get all the notifications of the user
    this.chatService.getNotifications().subscribe(notifications => {
      if (notifications) {
        this.handleNotifications(notifications["notifications"]);
      }
    });
  }

  handleNotifications(notificationsData) {
    if (notificationsData && notificationsData.length) {
      this.notifications = notificationsData.map(notification => {
        if (notification.type === "message") {
          notification.message = `You received ${notification.messageCount} new message from ${notification.senderName}`;
        }
        return notification;
      });
    }
  }

  redirectToChatRoom(notification) {
    // Call API to remove the notification from notifications DB
    this.pullNotification(notification).then(res => {

      //Extract notificationss
      let notifications = null;
      if (res["body"] && res["body"][0]) {
        notifications = res["body"][0]["notifications"];
      }

      //update notifications
      this.handleNotifications(notifications);

      //Set selectedRoomId in localStorage
      this.localStorageService.setItem("selectedRoomId", notification.roomId);

      //Close notification dialog
      this.dialogRef.close();

      //Redirect to chat room
      this.router.navigateByUrl(`chat/${this.loggedInUser._id}`);
    });
  }

  pullNotification(notification) {
    return new Promise((resolve, reject) => {
      let filter = {};
      filter["userId"] = this.loggedInUser._id;
      filter["type"] = notification.type;
      filter["senderName"] = notification.senderName;
      this.loaderService.showLoader();
      this.httpService.putRequest(`notifications/pullNotification`, { ...filter }).subscribe(
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
}
