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
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ChatService } from "./utils/service/chat.service";
import { ChatComponent } from './chat/chat.component';
// import { JwtModule } from '@auth0/angular-jwt';

const MatModules = [MatDialogModule, MatExpansionModule, MatFormFieldModule, MatTabsModule, MatInputModule, MatTooltipModule];

// export function tokenGetter() {
//   return localStorage.getItem("nestjs-chat-app");
// }
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ProductCardComponent,
    NavigationBarComponent,
    LoginComponent,
    ProductDetailsComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    MatModules,
    ReactiveFormsModule,
    FormsModule,
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     allowedDomains: ['localhost:3000']
    //   }
    // })
  ],
  providers: [HttpService, LocalStorageService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule {}
