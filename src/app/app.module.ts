import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { ProductCardComponent } from "./product-card/product-card.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "src/shared/modules/material/material.module";
import { HttpService } from "./utils/service/http.service";
import { HttpClientModule } from "@angular/common/http";
import { NavigationBarComponent } from "./navigation-bar/navigation-bar.component";
import { LoginComponent } from "./login/login.component";
import {
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatTabsModule,
  MatInputModule,
  MatTooltipModule
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { LocalStorageService } from "./utils/service/local.service";

const MatModules = [MatDialogModule, MatExpansionModule, MatFormFieldModule, MatTabsModule, MatInputModule, MatTooltipModule];
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ProductCardComponent,
    NavigationBarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    MatModules,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [HttpService, LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
