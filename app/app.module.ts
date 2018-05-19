import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { registerElement } from "nativescript-angular";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { TNSFontIconModule } from "nativescript-ngx-fonticon";

import { WeatherService } from "./services/weather.service";

// for ngx-translate
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { LanguageService } from "./services/language.service";

// for ngx-translate AoT compilation
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "/i18n/", ".json");
}

registerElement("MLKitBarcodeScanner", () => require("nativescript-plugin-firebase/mlkit/barcodescanning").MLKitBarcodeScanner);
registerElement("MLKitFaceDetection", () => require("nativescript-plugin-firebase/mlkit/facedetection").MLKitFaceDetection);
registerElement("MLKitTextRecognition", () => require("nativescript-plugin-firebase/mlkit/textrecognition").MLKitTextRecognition);
registerElement("MLKitImageLabeling", () => require("nativescript-plugin-firebase/mlkit/imagelabeling").MLKitImageLabeling);

registerElement("Gradient", () => require("nativescript-gradient").Gradient);

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptHttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        deps: [HttpClient],
        useFactory: createTranslateLoader
      }
    }),
    TNSFontIconModule.forRoot({
      fa: "./assets/css/font-awesome.css"
    })
  ],
  declarations: [AppComponent],
  providers: [LanguageService, WeatherService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
