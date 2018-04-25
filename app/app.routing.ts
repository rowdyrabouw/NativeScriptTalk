import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "/slider", pathMatch: "full" },
  { path: "home", loadChildren: "./components/home/home.module#HomeModule" },
  { path: "slider", loadChildren: "./components/slider/slider.module#SliderModule" }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
