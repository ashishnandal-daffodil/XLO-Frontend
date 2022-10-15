import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "src/app/utils/service/localStorage/local.service";
import { LoaderService } from "src/app/utils/service/loader/loader.service";
import { HttpService } from "src/app/utils/service/http/http.service";
import { SnackbarService } from "src/app/utils/service/snackBar/snackbar.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-all-catgeories-dialog",
  templateUrl: "./all-categories-dialog.component.html",
  styleUrls: ["./all-categories-dialog.component.css"]
})
export class AllCatgeoriesDialogComponent implements OnInit {
  loggedInUser: any = {};
  categories: string[] = [
    "Vehicles",
    "Electronics & Appliances",
    "Furniture",
    "For Rent: House and Apartments",
    "For Sale: House and Apartments",
    "Mobiles",
    "Fashion",
    "Book, Sports & Hobbies",
    "Pets",
    "Services"
  ];
  selectedCategory: string;

  constructor(
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private httpService: HttpService,
    private snackBarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
  }

  selectCategory(category){
    this.selectedCategory = category;
  }
}
