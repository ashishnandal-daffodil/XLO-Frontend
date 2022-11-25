import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  open(message, type) {
    if (type === "success") {
      this.snackBar.open(message, "Close", {
        duration: 1500
      });
    } else if (type === "error") {
      this.snackBar.open(message, "Try again", {
        duration: 1500
      });
    } else if (type === "messageNotification") {
      let notification = `You have received 1 new message from ${message.sender}`;
      this.snackBar.open(notification, "Okay", {
        duration: 5000
      });
    } else {
      this.snackBar.open(message, "Okay", {
        duration: 1500
      });
    }
  }
}
