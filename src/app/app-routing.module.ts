import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChatComponent } from "./chat/chat.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";

const routes: Routes = [
  {
    path: "",
    component: ChatComponent
  },
  {
    path: "productDetails/:productId",
    component: ProductDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
