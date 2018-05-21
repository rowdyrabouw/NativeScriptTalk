import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TranslateModule } from "@ngx-translate/core";

import { MLComponent } from "./ml.component";
import { MLRoutingModule } from "./ml-routing.module";

import { TextRecognitionComponent } from "./textrecognition/textrecognition.component";
import { BarcodeScanningComponent } from "./barcodescanning/barcodescanning.component";
import { FaceDetectionComponent } from "./facedetection/facedetection.component";
import { ImageLabelingComponent } from "./imagelabeling/imagelabeling.component";

@NgModule({
  imports: [NativeScriptCommonModule, TranslateModule, MLRoutingModule],
  declarations: [BarcodeScanningComponent, FaceDetectionComponent, ImageLabelingComponent, MLComponent, TextRecognitionComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MLModule {}
