import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TranslateModule } from "@ngx-translate/core";

import { SliderIconDirective } from "./slider.directive";

import { SliderRoutingModule } from "./slider-routing.module";
import { SliderComponent } from "./slider.component";

@NgModule({
  imports: [NativeScriptCommonModule, TranslateModule, SliderRoutingModule],
  declarations: [SliderComponent, SliderIconDirective],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SliderModule {}
