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
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { LocalStorageService } from "./utils/service/local.service";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { ChatService } from "./utils/service/chat.service";
import { ChatComponent } from "./chat/chat.component";
import { DateService } from "./utils/service/date.service";
import { MatListModule } from "@angular/material/list";
import { ChatCardComponent } from "./chat/chat-card/chat-card.component";
import { MessageComponent } from "./chat/message/message.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";

export function tokenGetter() {
  let localStorageService = new LocalStorageService();
  return localStorageService.getItem("auth");
}

const MatSnackBarOptions = [
  {
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: { duration: 2000, horizontalPosition: "right", verticalPosition: "top" }
  }
];

const MatModules = [
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatTabsModule,
  MatInputModule,
  MatTooltipModule,
  MatListModule,
  MatSnackBarModule
];

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ProductCardComponent,
    NavigationBarComponent,
    LoginComponent,
    ProductDetailsComponent,
    ChatComponent,
    ChatCardComponent,
    MessageComponent
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
  providers: [HttpService, LocalStorageService, ChatService, DateService, MatSnackBarOptions],
  bootstrap: [AppComponent]
})
export class AppModule {}
