import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { HttpService } from "../utils/service/http/http.service";
import { Router } from "@angular/router";
import { OpenLoginDialogService } from "../utils/service/openLoginDialog/open-login-dialog.service";
import { UserProfileService } from "../utils/service/userProfile/user-profile.service";
import { LoaderService } from "../utils/service/loader/loader.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { ChatService } from "../utils/service/chat/chat.service";
import { environment } from "src/environments/environment";
import { CommonAPIService } from "../utils/commonAPI/common-api.service";
import { NotificationDialogService } from "../utils/service/notification/notification-dialog.service";
import { CategoriesService } from "../utils/service/categories/categories.service";
import { ProductsService } from "../utils/service/products/products.service";
@Component({
  selector: "app-navigation-bar",
  templateUrl: "./navigation-bar.component.html",
  styleUrls: ["./navigation-bar.component.css"]
})
export class NavigationBarComponent implements OnInit {
  loggedInUser: any;
  userProfileDialogOpen: Boolean = false;
  notificationDialogOpen: Boolean = false;
  dialogRef: MatDialogRef<any>;
  previousSearchInput: string = "";
  searchInput: string = "";
  allCategories = [];
  filteredSuggestions = [];
  filterInput: string;
  allSuggestions = [];
  initialSuggestions = [];
  imgSrc: string = null;
  nameInitials: string = "";
  notificationsLength = 0;
  chatsOpen: boolean = false;
  loggedInUserName: string = "";

  @ViewChild("userProfile") userProfile: ElementRef;

  constructor(
    public dialog: MatDialog,
    public localStorageService: LocalStorageService,
    public httpService: HttpService,
    public openLoginDialogService: OpenLoginDialogService,
    public userProfileService: UserProfileService,
    public router: Router,
    private loaderService: LoaderService,
    private snackBarService: SnackbarService,
    private chatService: ChatService,
    private commonAPIService: CommonAPIService,
    private notificationDialogService: NotificationDialogService,
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    if (this.loggedInUser) {
      this.splitUserName();
      this.subscribeToSocketEvents();
      this.getMyNotifications().then(notifications => {
        if (notifications[0]) {
          this.notificationsLength = notifications[0].notifications.length;
        }
      });
    }
    this.categoriesService.getCategories.subscribe(res => {
      this.allCategories = this.handleAllCategories(res);
      this.filteredSuggestions = this.handleAllCategories(res);
    });
  }

  ngAfterViewInit(): void {
    if (this.loggedInUser) {
      if (this.loggedInUser?.profile_image_filename) {
        this.imgSrc = `${environment.baseUrl}/users/profileimage/${this.loggedInUser.profile_image_filename}`;
      }
    }
  }

  splitUserName() {
    let nameSplit = this.loggedInUser.name.split(" ");
    return nameSplit.forEach((name, index) => {
      index < 2 ? (this.loggedInUserName = this.loggedInUserName + " " + name) : null;
    });
  }

  subscribeToSocketEvents() {
    //Show snackBar whenever new message is received an chat window is not open
    this.chatService.getMessage().subscribe(async res => {
      if (res["latest_message"]["sender"] != this.loggedInUser._id) {
        if (!this.chatsOpen) {
          await this.createMessageNotification(res).then(notification => {
            this.snackBarService.open(notification, "messageNotification");
          });
        }
      }
    });

    //get all the notifications of the user
    this.chatService.getNotifications().subscribe(notifications => {
      if (notifications[0] && notifications[0]["notifications"].length) {
        if (this.chatsOpen) {
          this.removeMessageNotifications();
        } else {
          this.notificationsLength = notifications[0]["notifications"].length;
        }
      } else {
        this.notificationsLength = 0;
      }
    });

    //Listen to route change event
    this.router.events.subscribe(event => {
      if (event && event["url"]) {
        this.chatsOpen = event["url"].includes("chat");
      }
    });
  }

  removeMessageNotifications() {
    return new Promise((resolve, reject) => {
      let filter = {};
      filter["userId"] = this.loggedInUser._id;
      this.loaderService.showLoader();
      this.httpService.putRequest(`notifications/removeMessageNotifications`, { ...filter }).subscribe(
        res => {
          this.loaderService.hideLoader();
          resolve(res);
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.REMOVE_DATA_ERROR, "error");
          reject(err);
        }
      );
    });
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
          this.snackBarService.open(errorMessages.FETCH_DATA_ERROR, "error");
          reject(err);
        }
      );
    });
  }

  createMessageNotification(data) {
    return new Promise(async (resolve, reject) => {
      let senderId = data?.latest_message?.sender;
      await this.commonAPIService.getUserDetails(senderId).subscribe(senderDetails => {
        let sender = senderDetails["name"];
        resolve(`You have received a new message from ${sender}`);
      });
    });
  }

  openLoginDialog() {
    this.openLoginDialogService.openLoginDialog();
  }

  handleNotificationDialog() {
    if (this.notificationDialogOpen) {
      this.closeNotificationDialog();
    } else {
      this.openNotificationDialog();
    }
  }

  openNotificationDialog() {
    const dialogRef = this.notificationDialogService.openNotificationDialog();
    dialogRef.updatePosition({ top: "65px", right: "20vw" });
    this.notificationDialogOpen = true;
    dialogRef.afterClosed().subscribe(result => {
      this.notificationDialogOpen = false;
    });
  }

  closeNotificationDialog() {
    this.notificationDialogOpen = false;
    this.notificationDialogService.closeDialog();
  }

  handleUserProfileDialog() {
    if (this.userProfileDialogOpen) {
      this.closeUserProfileDialog();
    } else {
      this.openUserProfileDialog();
    }
  }

  openUserProfileDialog() {
    const dialogRef = this.userProfileService.openUserProfileDialog();
    dialogRef.updatePosition({ top: "65px", right: "8vw" });
    this.userProfileDialogOpen = true;
    dialogRef.afterClosed().subscribe(result => {
      this.userProfileDialogOpen = false;
    });
  }

  closeUserProfileDialog() {
    this.userProfileDialogOpen = false;
    this.userProfileService.closeDialog();
  }

  filterCategories(event?) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      return;
    }
    //filter the categories
    this.filterInput = event ? event.target.value : "";
    this.filteredSuggestions = this.allCategories.filter(categoryObj => {
      return categoryObj.heading.toLowerCase().includes(this.filterInput.toLowerCase());
    });

    //get latest suggestions on the basis of input
    let filter = {};
    filter["filterKey"] = this.filterInput;
    this.productsService.getLatestSuggestions(filter).subscribe(res => {
      let extractedSuggestions = [];
      for (let suggestion of <[]>res) {
        extractedSuggestions.push(suggestion["_source"]);
      }
      this.allSuggestions = extractedSuggestions;
      this.initialSuggestions = extractedSuggestions;
      this.handleSuggestions();
    });
  }

  getProducts(filter?) {
    if (!filter) {
      this.router.navigate(["/"], { queryParams: { filter: this.filterInput } }).then(() => {
        window.location.reload();
      });
    } else {
      this.router.navigate(["/"], { queryParams: { filter: filter } }).then(() => {
        window.location.reload();
      });
    }
  }

  handleSuggestions() {
    if (this.allSuggestions.length > 0) {
      this.allSuggestions.map(suggestion => {
        let heading,
          subheading,
          insert = true;
        if (suggestion?.title && suggestion?.title.toLowerCase().includes(this.filterInput.toLowerCase())) {
          heading = suggestion.title;
          subheading = suggestion.category;
        } else if (
          suggestion?.location &&
          suggestion?.location.toLowerCase().includes(this.filterInput.toLowerCase())
        ) {
          heading = suggestion.location;
          subheading = null;
        } else if (
          suggestion?.subcategory &&
          suggestion?.subcategory.toLowerCase().includes(this.filterInput.toLowerCase())
        ) {
          heading = suggestion.subcategory;
          subheading = null;
        } else {
          heading = suggestion?.category;
          subheading = null;
        }

        for (let i = 0; i < this.filteredSuggestions.length; i++) {
          if (this.filteredSuggestions[i].heading === heading) {
            insert = false;
            break;
          }
        }
        if (insert) {
          this.filteredSuggestions.push({
            heading: heading ? heading : null,
            subheading: subheading ? subheading : null
          });
        }
      });
    }
  }

  // filterSuggestions() {
  //   this.allSuggestions = this.initialSuggestions.filter(suggestion => {
  //     for (const key in suggestion) {
  //       if (suggestion[key].toLowerCase().includes(this.filterInput.toLowerCase())) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   });
  // }

  handleAllCategories(data) {
    let formattedCategories = [];
    if (data.length > 0) {
      data.map(category => {
        formattedCategories.push({ heading: category.category_name, subheading: null });
        category.subcategories.map(subcategory => {
          formattedCategories.push({ heading: subcategory, subheading: category.category_name });
        });
      });
    }
    return formattedCategories;
  }

  redirectToUserProfile() {
    this.localStorageService.setItem("userProfileSelectedTabIndex", 1);
    this.router.navigateByUrl(`/userProfile/${this.loggedInUser._id}`);
  }

  redirectToSellProduct() {
    if (this.loggedInUser) {
      this.router.navigateByUrl(`/postAdd`);
    } else {
      this.openLoginDialog();
    }
  }
}
