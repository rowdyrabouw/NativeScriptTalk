import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { TranslateModule } from "@ngx-translate/core";

import { MipRoutingModule } from "./mip-routing.module";
import { ScanComponent } from "./scan.component";
import { ControlsComponent } from "./controls.component";

@NgModule({
  imports: [TranslateModule, TNSFontIconModule, NativeScriptCommonModule, MipRoutingModule],
  declarations: [ScanComponent, ControlsComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MipModule {}
