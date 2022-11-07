import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChatComponent } from "./chat/chat.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { PostAddComponent } from "./post-add/post-add.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { ViewProfileComponent } from "./user-profile/view-profile/view-profile.component";

const routes: Routes = [
  {
    path: "",
    component: HomepageComponent
  },
  {
    path: "/:category",
    component: HomepageComponent
  },
  {
    path: "productDetails/:productId",
    component: ProductDetailsComponent
  },
  {
    path: "chat/:userId",
    component: ChatComponent
  },
  {
    path: "userProfile/:userId",
    component: UserProfileComponent
  },
  {
    path: "postAdd",
    component: PostAddComponent
  },
  {
    path: "editAdd",
    component: PostAddComponent
  },
  {
    path: "**",
    pathMatch: "full",
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
