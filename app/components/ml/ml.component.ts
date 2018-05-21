import { Component, NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { ImageSource } from "tns-core-modules/image-source";
import { action } from "tns-core-modules/ui/dialogs";
import { ImageAsset } from "tns-core-modules/image-asset";
import { isIOS } from "tns-core-modules/platform";
import * as ImagePicker from "nativescript-imagepicker";
import * as Camera from "nativescript-camera";
import { BarcodeFormat, MLKitScanBarcodesOnDeviceResult } from "nativescript-plugin-firebase/mlkit/barcodescanning";
import { MLKitLandmarkRecognitionCloudResult } from "nativescript-plugin-firebase/mlkit/landmarkrecognition";
import { MLKitDetectFacesOnDeviceResult } from "nativescript-plugin-firebase/mlkit/facedetection";
import { MLKitRecognizeTextCloudResult, MLKitRecognizeTextOnDeviceResult } from "nativescript-plugin-firebase/mlkit/textrecognition";
import { MLKitImageLabelingCloudResult, MLKitImageLabelingOnDeviceResult } from "nativescript-plugin-firebase/mlkit/imagelabeling";

const firebase = require("nativescript-plugin-firebase");
const translate = require("translate");

@Component({
  selector: "ml",
  moduleId: module.id,
  templateUrl: "./ml.component.html",
  styleUrls: ["ml.component.css"]
})
export class MLComponent {
  pickedImage: ImageSource;

  private mlkitFeatures: Array<string> = [
    "Text recognition (on device)",
    "Image labeling (on device)",
    "Image labeling (cloud)",
    "Landmark recognition (cloud)"
  ];

  private mlkitOnDeviceFeatures: Array<string> = ["Text recognition", "Image labeling"];

  constructor(private routerExtensions: RouterExtensions, private zone: NgZone) {}

  fromCameraPicture(): void {
    if (!isIOS) {
      Camera.requestPermissions();
    }
    Camera.takePicture({
      width: 800,
      height: 800,
      keepAspectRatio: true,
      saveToGallery: false,
      cameraFacing: "rear"
    }).then(imageAsset => {
      new ImageSource().fromAsset(imageAsset).then(imageSource => {
        this.pickedImage = imageSource;
        // give the user some to to see the picture
        setTimeout(() => this.selectMLKitFeature(imageSource), 500);
      });
    });
  }

  fromCameraroll(): void {
    const imagePicker = ImagePicker.create({
      mode: "single"
    });

    imagePicker
      .authorize()
      .then(() => imagePicker.present())
      .then((selection: Array<ImageAsset>) => {
        if (selection.length === 0) return;

        const selected = selection[0];
        selected.options.height = 800;
        selected.options.width = 800;
        selected.options.keepAspectRatio = true;
        selected.getImageAsync((image: any, error: any) => {
          if (error) {
            console.log(`Error getting image source from picker: ${error}`);
            return;
          }
          if (!image) {
            alert({
              title: `Invalid image`,
              message: `Perhaps this is an image from cloud storage?`,
              okButtonText: "Hmm.."
            });
            return;
          }
          const imageSource = new ImageSource();
          imageSource.setNativeSource(image);
          this.zone.run(() => {
            this.pickedImage = imageSource;
          });
          // give the user some to to see the picture
          setTimeout(() => this.selectMLKitFeature(imageSource), 500);
        });
      })
      .catch(e => {
        console.log(`Image Picker error: ${e}`);
      });
  }

  reusePickedImage(): void {
    this.selectMLKitFeature(this.pickedImage);
  }

  private selectMLKitFeature(imageSource: ImageSource): void {
    action("Use which ML Kit feature?", "Cancel", this.mlkitFeatures).then((pickedItem: string) => {
      let pickedItemIndex = this.mlkitFeatures.indexOf(pickedItem);
      if (pickedItem === "Text recognition (on device)") {
        this.recognizeTextOnDevice(imageSource);
      } else if (pickedItem === "Image labeling (on device)") {
        this.labelImageOnDevice(imageSource);
      } else if (pickedItem === "Image labeling (cloud)") {
        this.labelImageCloud(imageSource);
      } else if (pickedItem === "Landmark recognition (cloud)") {
        this.recognizeLandmarkCloud(imageSource);
      }
    });
  }

  private recognizeTextOnDevice(imageSource: ImageSource): void {
    firebase.mlkit.textrecognition
      .recognizeTextOnDevice({
        image: imageSource
      })
      .then((result: MLKitRecognizeTextOnDeviceResult) => {
        let message = result.blocks.map(block => block.text).join("");
        console.log(message);

        translate.engine = "yandex";
        translate.key = "trnsl.1.1.20180520T132853Z.e5bbe8467d75baec.54d733ec62225cc057c1b811847e4c637e0196e4";

        translate(message.toLowerCase(), { from: "nl", to: "en" }).then(text => {
          console.log(text);
          alert({
            title: `Result`,
            message: text,
            okButtonText: "OK"
          });
        });
      })
      .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
  }

  private recognizeLandmarkCloud(imageSource: ImageSource): void {
    firebase.mlkit.landmarkrecognition
      .recognizeLandmarksCloud({
        image: imageSource,
        maxResults: 8
      })
      .then((result: MLKitLandmarkRecognitionCloudResult) => {
        alert({
          title: `Result`,
          message: JSON.stringify(result.landmarks),
          okButtonText: "OK"
        });
      })
      .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
  }

  private labelImageOnDevice(imageSource: ImageSource): void {
    firebase.mlkit.imagelabeling
      .labelImageOnDevice({
        image: imageSource,
        confidenceThreshold: 0.3
      })
      .then((result: MLKitImageLabelingOnDeviceResult) => {
        alert({
          title: `Result`,
          message: JSON.stringify(result.labels),
          okButtonText: "OK"
        });
      })
      .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
  }

  private labelImageCloud(imageSource: ImageSource): void {
    firebase.mlkit.imagelabeling
      .labelImageCloud({
        image: imageSource,
        modelType: "stable",
        maxResults: 5
      })
      .then((result: MLKitImageLabelingCloudResult) => {
        alert({
          title: `Result`,
          message: JSON.stringify(result.labels),
          okButtonText: "OK"
        });
      })
      .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
  }
}
