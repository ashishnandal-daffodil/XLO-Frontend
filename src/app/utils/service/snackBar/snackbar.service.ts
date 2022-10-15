import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  open(message, type) {
    if (type==='success'){
      this.snackBar.open(message, "Close", {
        duration: 2000
      });
    } else {
      this.snackBar.open(message, "Try again");
    }
  }
}
