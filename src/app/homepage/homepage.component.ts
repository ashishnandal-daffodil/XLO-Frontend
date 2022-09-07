import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpService } from "../utils/service/http.service";
import _ from "lodash";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"]
})
export class HomepageComponent implements OnInit {
  products: any = [
    {
      id: 1,
      title: "i20 Magna",
      price: "570000",
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    },
    {
      id: 1,
      title: "i20 Magna",
      price: 570000,
      description: "Car for Sale",
      category: "Car",
      purchased_on: "23 Aug 2019",
      owner: 1,
      photos: [],
      thumbnail_url: "",
      thumbnail_uploaded: false,
      active: true,
      created_on: "2 Sep 2021",
      updated_on: null,
      expire_on: "2 Oct 2022",
      closed_on: null,
      location: { city: "Hisar", state: "Haryana" }
    }
  ];
  scrollContainer: any;
  isNearBottom: boolean = false;
  skip: number = 0;
  limit: number = 10;

  @ViewChild("scrollframe") scrollFrame: ElementRef;

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    // this.getProducts()
  }

  ngAfterViewInit() {
    this.scrollContainer = _.get(this.scrollFrame, "nativeElement");
  }

  isUserNearBottom(): boolean {
    let threshold = 1;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled() {
    console.log("🚀 ~ file: homepage.component.ts ~ line 506 ~ HomepageComponent ~ scrolled ~ scrolled");
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
    this.httpService.getRequest(`products/allProduct`).subscribe(
      res => {
        this.products = _.get(res, "result");
      },
      err => {
        console.log("Something went wrong", "Error");
      }
    );
  }
}
