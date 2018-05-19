// import { Component } from "@angular/core";
// import { MLKitRecognizeTextOnDeviceResult, MLKitRecognizeTextResultBlock } from "nativescript-plugin-firebase/mlkit/textrecognition";

// import { registerElement } from "nativescript-angular/element-registry";
// registerElement("MLKitTextRecognition", () => require("nativescript-plugin-firebase/mlkit/textrecognition").MLKitTextRecognition);

// @Component({
//   selector: "mlkit-textrecognition",
//   moduleId: module.id,
//   templateUrl: "./ml.component.html"
// })
// export class MLComponent {
//   blocks: Array<MLKitRecognizeTextResultBlock>;

//   onTextRecognitionResult(scanResult: any): void {
//     const value: MLKitRecognizeTextOnDeviceResult = scanResult.value;
//     this.blocks = value.blocks;
//   }
// }

import { Component } from "@angular/core";
import { MLKitImageLabelingOnDeviceResult } from "nativescript-plugin-firebase/mlkit/imagelabeling";

import { registerElement } from "nativescript-angular/element-registry";
registerElement("MLKitImageLabeling", () => require("nativescript-plugin-firebase/mlkit/").MLKitTextRecognition);

@Component({
  selector: "mlkit-imagelabeling",
  moduleId: module.id,
  templateUrl: "./ml.component.html"
})
export class MLComponent {
  labels: Array<{
    text: string;
    confidence: number;
  }>;

  onImageLabelingResult(scanResult: any): void {
    const value: MLKitImageLabelingOnDeviceResult = scanResult.value;
    this.labels = value.labels;
  }
}
