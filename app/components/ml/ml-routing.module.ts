import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { MLComponent } from "./ml.component";
import { TextRecognitionComponent } from "./textrecognition/textrecognition.component";
import { BarcodeScanningComponent } from "./barcodescanning/barcodescanning.component";
import { FaceDetectionComponent } from "./facedetection/facedetection.component";
import { ImageLabelingComponent } from "./imagelabeling/imagelabeling.component";

const routes: Routes = [
  { path: "", component: MLComponent },
  { path: "textrecognition", component: TextRecognitionComponent },
  { path: "barcodescanning", component: BarcodeScanningComponent },
  { path: "facedetection", component: FaceDetectionComponent },
  { path: "imagelabeling", component: ImageLabelingComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class MLRoutingModule {}
