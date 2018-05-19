import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { MLKitComponent } from "./mlkit.component";
import { MLKitRoutingModule } from "./mlkit-routing.module";

import { TextRecognitionComponent } from "./textrecognition/textrecognition.component";
import { BarcodeScanningComponent } from "./barcodescanning/barcodescanning.component";
import { FaceDetectionComponent } from "./facedetection/facedetection.component";
import { ImageLabelingComponent } from "./imagelabeling/imagelabeling.component";

@NgModule({
  imports: [NativeScriptCommonModule, MLKitRoutingModule],
  declarations: [BarcodeScanningComponent, FaceDetectionComponent, ImageLabelingComponent, MLKitComponent, TextRecognitionComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MLKitModule {}
