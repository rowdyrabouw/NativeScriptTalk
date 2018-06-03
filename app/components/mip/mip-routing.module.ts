import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ScanComponent } from "./scan.component";
import { ControlsComponent } from "./controls.component";

const routes: Routes = [{ path: "", component: ScanComponent }, { path: "controls", component: ControlsComponent }];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class MipRoutingModule {}
