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
@Component({
  selector: "app-navigation-bar",
  templateUrl: "./navigation-bar.component.html",
  styleUrls: ["./navigation-bar.component.css"]
})
export class NavigationBarComponent implements OnInit {
  loggedInUser: any;
  userProfileDialogOpen: Boolean = false;
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
  notifications = [];

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
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    if (this.loggedInUser) {
      this.initializeSubscriptions();
    }
    this.getCategories();
  }

  ngAfterViewInit(): void {
    if (this.loggedInUser) {
      if (this.loggedInUser?.profile_image_filename) {
        this.imgSrc = `${environment.baseUrl}/users/profileimage/${this.loggedInUser.profile_image_filename}`;
      } else {
        this.extractNameInitials();
      }
    }
  }

  initializeSubscriptions() {
    this.chatService.getMessage().subscribe(async res => {
      if (res["latest_message"]["sender"] != this.loggedInUser._id) {
        await this.createMessageNotification(res).then(notification => {
          this.snackBarService.open(notification, "messageNotification");
          this.notifications.push(notification);
        });
      }
    });
  }

  createMessageNotification(data) {
    return new Promise(async (resolve, reject) => {
      let notification = {};
      notification["message"] = data?.latest_message?.message;
      notification["time"] = data?.latest_message?.created_on;
      let senderId = data?.latest_message?.sender;
      await this.getUserDetails(senderId)
        .then(senderDetails => {
          notification["sender"] = senderDetails["name"];
          resolve(notification);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getUserDetails(userId) {
    return new Promise((resolve, reject) => {
      let filter = {};
      filter["userId"] = userId;
      this.loaderService.showLoader();
      this.httpService.getRequest(`users/getDetails`, { ...filter }).subscribe(
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

  extractNameInitials() {
    let name = this.loggedInUser.name;
    let nameSplit = name.split(" ");
    nameSplit.forEach((name, index) => {
      index < 2 ? (this.nameInitials += name.charAt(0)) : null;
    });
  }

  openLoginDialog() {
    this.openLoginDialogService.openLoginDialog();
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

  getCategories() {
    return new Promise((resolve, reject) => {
      this.loaderService.showLoader();
      this.httpService.getRequest(`categories/allCategories/`).subscribe(
        res => {
          this.allCategories = this.handleAllCategories(res);
          this.filteredSuggestions = this.handleAllCategories(res);
          this.loaderService.hideLoader();
          resolve(res);
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.GET_CATEGORIES_ERROR, "error");
          reject(err);
        }
      );
    });
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

    if (this.filterInput.length <= 1) {
      //get latest suggestions on the basis of input
      new Promise((resolve, reject) => {
        let filter = {};
        filter["filterKey"] = this.filterInput;
        this.loaderService.showLoader();
        this.httpService.getRequest(`products/suggestions/`, { ...filter }).subscribe(
          res => {
            this.allSuggestions = res;
            this.initialSuggestions = res;
            this.handleSuggestions();
            this.loaderService.hideLoader();
            resolve(res);
          },
          err => {
            this.loaderService.hideLoader();
            this.snackBarService.open(errorMessages.GET_CATEGORIES_ERROR, "error");
            reject(err);
          }
        );
      });
    } else {
      //filter the already existing list of suggestions
      this.filterSuggestions();
      this.handleSuggestions();
    }
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

  filterSuggestions() {
    this.allSuggestions = this.initialSuggestions.filter(suggestion => {
      for (const key in suggestion) {
        if (suggestion[key].toLowerCase().includes(this.filterInput.toLowerCase())) {
          return true;
        }
      }
      return false;
    });
  }

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

  handleNotification() {}
}
