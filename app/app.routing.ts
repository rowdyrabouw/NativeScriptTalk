import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", loadChildren: "./components/home/home.module#HomeModule" },
  { path: "mip", loadChildren: "./components/mip/mip.module#MipModule" },
  { path: "ml", loadChildren: "./components/ml/ml.module#MLModule" },
  { path: "mlkit", loadChildren: "./components/mlkit/mlkit.module#MLKitModule" },
  { path: "slider", loadChildren: "./components/slider/slider.module#SliderModule" },
  { path: "speechrecognition", loadChildren: "./components/speechrecognition/speechrecognition.module#SpeechRecognitionModule" }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
