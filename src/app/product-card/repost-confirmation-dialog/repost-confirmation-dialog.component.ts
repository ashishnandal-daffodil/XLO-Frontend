import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-repost-confirmation-dialog",
  templateUrl: "./repost-confirmation-dialog.component.html",
  styleUrls: ["./repost-confirmation-dialog.component.css"]
})
export class RepostConfirmationDialogComponent implements OnInit {
  close = {
    yes: "yes",
    no: "no"
  };
  constructor() {}

  ngOnInit(): void {}
}
