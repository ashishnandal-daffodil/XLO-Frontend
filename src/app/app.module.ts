import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { ProductComponent } from "./product/product.component";
import { ProductCardComponent } from "./product/product-card/product-card.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "src/shared/modules/material/material.module";
import { HttpService } from "./utils/service/http.service";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, HomepageComponent, ProductComponent, ProductCardComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule, MaterialModule],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule {}
