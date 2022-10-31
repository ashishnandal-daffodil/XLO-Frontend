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

  @ViewChild("userProfile") userProfile: ElementRef;

  constructor(
    public dialog: MatDialog,
    public localStorageService: LocalStorageService,
    public httpService: HttpService,
    public openLoginDialogService: OpenLoginDialogService,
    public userProfileService: UserProfileService,
    public router: Router,
    private loaderService: LoaderService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.getCategories();
  }

  ngAfterViewInit(): void {
    if (this.loggedInUser.profile_image_filename) {
      this.imgSrc = `http://localhost:3000/users/profileimage/${this.loggedInUser.profile_image_filename}`;
    } else {
      this.extractNameInitials();
    }
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
        if (suggestion.title.includes(this.filterInput)) {
          heading = suggestion.title;
          subheading = suggestion.category;
        } else if (suggestion.location.includes(this.filterInput)) {
          heading = suggestion.location;
          subheading = null;
        } else if (suggestion.subcategory.includes(this.filterInput)) {
          heading = suggestion.subcategory;
          subheading = null;
        } else {
          heading = suggestion.category;
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
        if (suggestion[key].includes(this.filterInput)) {
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
      });
    }
    return formattedCategories;
  }

  redirectToUserProfile() {
    this.localStorageService.setItem("userProfileSelectedTabIndex", 1);
    this.router.navigateByUrl(`/userProfile/${this.loggedInUser._id}`);
  }

  redirectToSellProduct() {
    this.router.navigateByUrl(`/postAdd/${this.loggedInUser._id}`);
  }
}
