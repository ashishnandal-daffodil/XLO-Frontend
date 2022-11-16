import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../utils/service/localStorage/local.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  selectedTabIndex: number = 0;
  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    let userProfileSelectedTabIndex = this.localStorageService.getItem("userProfileSelectedTabIndex");
    if (userProfileSelectedTabIndex) {
      this.selectedTabIndex = userProfileSelectedTabIndex;
      this.localStorageService.removeItem("userProfileSelectedTabIndex");
    }
  }

  selectTab(index: number) {
    this.selectedTabIndex = index;
  }

  onTabChange(event) {
    this.selectedTabIndex = event.index;
    this.localStorageService.setItem("userProfileSelectedTabIndex", this.selectedTabIndex);
  }
}
