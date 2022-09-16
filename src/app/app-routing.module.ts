import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChatComponent } from "./chat/chat.component";  
import { HomepageComponent } from "./homepage/homepage.component";

const routes: Routes = [
  { path: "", component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
