import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { TranslateModule } from "@ngx-translate/core";

import { MLRoutingModule } from "./ml-routing.module";
import { MLComponent } from "./ml.component";

@NgModule({
  imports: [TranslateModule, TNSFontIconModule, NativeScriptCommonModule, MLRoutingModule],
  declarations: [MLComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MLModule {}
