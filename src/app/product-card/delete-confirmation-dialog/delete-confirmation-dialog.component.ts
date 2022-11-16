import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-delete-confirmation-dialog",
  templateUrl: "./delete-confirmation-dialog.component.html",
  styleUrls: ["./delete-confirmation-dialog.component.css"]
})
export class DeleteConfirmationDialogComponent implements OnInit {
  close = {
    permanently: "permanently",
    recycle: "recycle",
    cancel: "cancel"
  };
  isActive: boolean;
  constructor() {}

  ngOnInit(): void {}
}
