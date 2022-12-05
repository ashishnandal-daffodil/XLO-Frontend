import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { ProductCardComponent } from "./product-card/product-card.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "src/shared/modules/material/material.module";
import { HttpService } from "./utils/service/http/http.service";
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
import { LocalStorageService } from "./utils/service/localStorage/local.service";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { ChatService } from "./utils/service/chat/chat.service";
import { ChatComponent } from "./chat/chat.component";
import { MatListModule } from "@angular/material/list";
import { ChatCardComponent } from "./chat/chat-card/chat-card.component";
import { MessageComponent } from "./chat/message/message.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { LoaderComponent } from "./utils/service/loader/loader.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { UserProfileDialogComponent } from "./user-profile-dialog/user-profile-dialog.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { EditUserProfileComponent } from "./user-profile/edit-user-profile/edit-user-profile.component";
import { CategoryHeaderComponent } from "./category-header/category-header.component";
import { AllCatgeoriesDialogComponent } from "./category-header/all-categories-dialog/all-categories-dialog.component";
import { MatChipsModule } from "@angular/material/chips";
import { EditProfilePictureComponent } from "./user-profile/edit-profile-picture/edit-profile-picture.component";
import { ViewProfileComponent } from "./user-profile/view-profile/view-profile.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { PostAddComponent } from "./post-add/post-add.component";
import { MatTreeModule } from "@angular/material/tree";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSelectModule } from "@angular/material/select";
import { CurrencyPipe } from "@angular/common";
import { DeleteConfirmationDialogComponent } from "./product-card/delete-confirmation-dialog/delete-confirmation-dialog.component";
import { RepostConfirmationDialogComponent } from "./product-card/repost-confirmation-dialog/repost-confirmation-dialog.component";
import { MatSliderModule } from "@angular/material/slider";
import { DatePipe } from "./utils/pipes/date.pipe";
import { MatBadgeModule } from "@angular/material/badge";
import { extractNameInitialsPipe } from "./utils/pipes/extract-name-initials.pipe";
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';

export function tokenGetter() {
  let localStorageService = new LocalStorageService();
  return localStorageService.getItem("auth");
}

const MatSnackBarOptions = [
  {
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: { horizontalPosition: "center", verticalPosition: "top" }
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
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatSidenavModule,
  MatTreeModule,
  MatStepperModule,
  MatSelectModule,
  MatSliderModule,
  MatBadgeModule
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
    MessageComponent,
    LoaderComponent,
    UserProfileDialogComponent,
    UserProfileComponent,
    EditUserProfileComponent,
    CategoryHeaderComponent,
    AllCatgeoriesDialogComponent,
    EditProfilePictureComponent,
    ViewProfileComponent,
    PostAddComponent,
    PageNotFoundComponent,
    DeleteConfirmationDialogComponent,
    RepostConfirmationDialogComponent,
    DatePipe,
    extractNameInitialsPipe,
    NotificationDialogComponent
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
  providers: [HttpService, LocalStorageService, ChatService, MatSnackBarOptions, CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
