import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "/tabs", pathMatch: "full" },
  { path: "home", loadChildren: "./components/home/home.module#HomeModule" },
  // { path: "ml", loadChildren: "./components/ml/ml.module#MLModule" },
  { path: "tabs", loadChildren: "./components/tabs/tabs.module#TabsModule" },
  { path: "slider", loadChildren: "./components/slider/slider.module#SliderModule" },
  { path: "speechrecognition", loadChildren: "./components/speechrecognition/speechrecognition.module#SpeechRecognitionModule" }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
