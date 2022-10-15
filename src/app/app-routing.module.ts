import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChatComponent } from "./chat/chat.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { UserProfileDialogComponent } from "./user-profile-dialog/user-profile-dialog.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";

const routes: Routes = [
  {
    path: "",
    component: HomepageComponent
  },
  {
    path: "productDetails/:productId",
    component: ProductDetailsComponent
  },
  {
    path: "chat/:userId",
    component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
