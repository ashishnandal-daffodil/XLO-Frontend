import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.css"]
})
export class ProductCardComponent implements OnInit {
  @Input("product") product: any = {};

  constructor() {}

  ngOnInit() {
    console.log("product-card");
  }

  onClick(event) {
    console.log("🚀 ~ file: product-card.component.ts ~ line 18 ~ ProductCardComponent ~ onClick ~ event", event)
  }
}
