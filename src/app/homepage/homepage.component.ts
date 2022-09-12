import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpService } from "../utils/service/http.service";
import _ from "lodash";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"],
})
export class HomepageComponent implements OnInit {
  scrollContainer: any;
  isNearBottom: boolean = false;
  skip: number = 0;
  limit: number = 10;
  products = [];

  @ViewChild("scrollframe") scrollFrame: ElementRef;

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.scrollContainer = _.get(this.scrollFrame, "nativeElement");
  }

  isUserNearBottom(): boolean {
    let threshold = 1;
    const position =
      this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled() {
    this.isNearBottom = this.isUserNearBottom();
    if (this.isNearBottom) {
      this.onScroll();
    }
  }

  onScroll() {
    this.getProducts(true);
  }

  getProducts(scrolled?) {
    let filter = {};
    this.skip = scrolled ? this.skip + 1 : this.skip;
    filter["skip"] = this.skip * this.limit;
    filter["limit"] = this.limit;
    this.httpService
      .getRequest(`products/allProduct/`, { ...filter })
      .subscribe(
        (res) => {
          // this.products = res;
          this.products.push(...res);
        },
        (err) => {
          console.log("Something went wrong", "Error");
        }
      );
  }
}
