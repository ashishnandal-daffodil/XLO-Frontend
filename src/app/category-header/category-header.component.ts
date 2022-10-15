import { Component, OnInit } from "@angular/core";
import { OpenAllCategoriesService } from "../utils/service/openAllCategories/open-all-categories.service";

@Component({
  selector: "app-category-header",
  templateUrl: "./category-header.component.html",
  styleUrls: ["./category-header.component.css"]
})
export class CategoryHeaderComponent implements OnInit {
  allCategoriesOpen: boolean = false;
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
  constructor(private openAllCategoriesServce: OpenAllCategoriesService) {}

  ngOnInit(): void {}

  handleAllCategories() {
    if (this.allCategoriesOpen) {
      this.closeAllCategories();
    } else {
      this.openAllCategories();
    }
  }
  openAllCategories() {
    const dialogRef = this.openAllCategoriesServce.openAllCategories();
    dialogRef.updatePosition({ top: "105px", left: "8vw" });
    this.allCategoriesOpen = true;
    dialogRef.afterClosed().subscribe(result => {
      this.allCategoriesOpen = false;
    });
  }

  closeAllCategories() {
    this.openAllCategoriesServce.closeDialog();
  }
}
