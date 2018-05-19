import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { MLKitComponent } from "./mlkit/mlkit.component";
import { TabsRoutingModule } from "./tabs-routing.module";
import { TabsComponent } from "./tabs.component";

import { TextRecognitionComponent } from "./mlkit/textrecognition/textrecognition.component";
import { BarcodeScanningComponent } from "./mlkit/barcodescanning/barcodescanning.component";
import { FaceDetectionComponent } from "./mlkit/facedetection/facedetection.component";
import { ImageLabelingComponent } from "./mlkit/imagelabeling/imagelabeling.component";

@NgModule({
  imports: [NativeScriptCommonModule, TabsRoutingModule],
  declarations: [BarcodeScanningComponent, FaceDetectionComponent, ImageLabelingComponent, MLKitComponent, TabsComponent, TextRecognitionComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class TabsModule {}
