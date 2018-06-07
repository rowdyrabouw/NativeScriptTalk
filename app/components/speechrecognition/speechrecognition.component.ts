import { Component, OnInit, NgZone, ViewChild, ElementRef } from "@angular/core";
import * as dialogs from "ui/dialogs";

import { SpeechRecognition, SpeechRecognitionTranscription } from "nativescript-speech-recognition";
import { TNSTextToSpeech, SpeakOptions } from "nativescript-texttospeech";
import * as camera from "nativescript-camera";
import * as SocialShare from "nativescript-social-share";
import { ImageSource } from "tns-core-modules/image-source";
import { Directions } from "nativescript-directions";

import * as bluetooth from "nativescript-bluetooth";

import { registerElement } from "nativescript-angular/element-registry";
registerElement("VideoPlayer", () => require("nativescript-videoplayer").Video);
// https://docs.nativescript.org/angular/plugins/angular-third-party.html#simple-elements

import { WeatherService } from "../../services/weather.service";
import { isIOS } from "tns-core-modules/ui/frame/frame";

@Component({
  moduleId: module.id,
  selector: "Speech",
  templateUrl: "speechrecognition.component.html",
  styleUrls: ["speechrecognition.component.css"]
})
export class SpeechRecognitionComponent implements OnInit {
  // lightbulb
  // private uuid = "CA9F644C-1750-4572-8833-1D137A9B9A05";
  private uuid = "C3371AAF-E6A5-4BB9-BA2E-6F45E0ACFA7A";
  private service = "ff0f";
  private characteristic = "fffc";

  private text2speech: TNSTextToSpeech;
  private speechRecognition: SpeechRecognition;
  private directions: Directions;
  private speakRate: number;
  recognizedText: string;
  spokenText: string;
  image: string;
  @ViewChild("videoplayer") VideoPlayer: ElementRef;
  @ViewChild("selfie") Selfie: ElementRef;
  isVideoVisible: boolean = false;
  isRecording: boolean = false;
  showImage: boolean = false;
  bluetoothConnected: boolean = false;

  constructor(private weatherService: WeatherService, private zone: NgZone) {}

  ngOnInit() {
    this.text2speech = new TNSTextToSpeech();
    this.speechRecognition = new SpeechRecognition();
    this.directions = new Directions();
    camera.requestPermissions();
    this.speakRate = isIOS ? 0.5 : 1;
  }

  showWeatherActionSheet() {
    dialogs
      .action({
        message: "Weather",
        cancelButtonText: "Cancel",
        actions: ["Vilnius", "Gouda", "Iran", "Lupin"]
      })
      .then(result => {
        console.log("Dialog result: " + result);
        this.getWeather(result);
      });
  }

  startListening() {
    this.recognizedText = "";
    this.spokenText = "";
    this.isRecording = true;
    this.showImage = false;
    this.speechRecognition
      .startListening({
        // optional, uses the device locale by default
        locale: "en-US",
        // set to true to get results back continuously
        returnPartialResults: true,
        // this callback will be invoked repeatedly during recognition
        onResult: (transcription: SpeechRecognitionTranscription) => {
          this.zone.run(() => (this.recognizedText = transcription.text));
          console.log(`User said: ${transcription.text}`);
          console.log(`User finished?: ${transcription.finished}`);
        }
      })
      .then(
        (started: boolean) => {
          console.log(`started listening`);
        },
        (errorMessage: string) => {
          console.log(`Error: ${errorMessage}`);
        }
      );
  }

  stopListening() {
    this.isRecording = false;
    this.speechRecognition.stopListening().then(
      () => {
        console.log(`stopped listening`);
        this.processInput();
      },
      (errorMessage: string) => {
        console.log(`Stop error: ${errorMessage}`);
      }
    );
  }

  private processInput() {
    let text = this.recognizedText;
    let speak: string;
    if (text.indexOf("introduce") > -1 || text.indexOf("yourself") > -1) {
      speak = "Hallo allemaal. Mijn naam is Jan. Het is geweldig om hier in Amsterdam te mogen zijn.";
      this.speakLocal(speak);
    } else if (text.indexOf("share") > -1 || text.indexOf("selfie") > -1) {
      speak = "That's a nice idea. Let's take a picture together and put it on Twitter!";
      this.speak(speak, "selfie");
    } else if (text.indexOf("weather") > -1 && text.indexOf("hometown") > -1) {
      this.getWeather("gouda");
    } else if (text.indexOf("movie") > -1) {
      speak = "I know you love superhero movies. Let's watch a part of the Deadpool 2 movie trailer.";
      this.speak(speak, "movie");
    } else if (text.indexOf("train") > -1) {
      speak = "Don't leave the Dutch PHP Conference yet Rowdy. But just in case, this is the route.";
      this.speak(speak, "directions");
    } else {
      speak = "I'm sorry Rowdy. I don't understand you.";
      this.speak(speak);
    }
  }

  private speak(aText: string, aAction?: string) {
    this.spokenText = aText;
    let speakOptions: SpeakOptions = {
      text: aText,
      speakRate: this.speakRate,
      pitch: 1.2,
      locale: "en-GB",
      finishedCallback: () => {
        if (aAction) {
          switch (aAction) {
            case "selfie":
              this.shareSelfie();
              break;
            case "movie":
              this.isVideoVisible = true;
              this.showMovie();
              break;
            case "directions":
              this.showDirections();
              break;
          }
        }
      }
    };
    this.text2speech.speak(speakOptions);
  }

  private speakLocal(aText: string) {
    this.spokenText = aText;
    let speakOptions: SpeakOptions = {
      text: aText,
      speakRate: this.speakRate,
      pitch: 1.2,
      locale: "nl-NL",
      finishedCallback: () => {
        let speak = "I will continue in English so you all can understand what I am saying. So call me John please.";
        this.zone.run(() => (this.spokenText = speak));
        this.speak(speak);
      }
    };
    this.text2speech.speak(speakOptions);
  }

  private showMovie() {
    dialogs.confirm("Rotate!").then(result => {
      this.zone.run(() => (this.isVideoVisible = true));
      this.VideoPlayer.nativeElement.height = "100%";
      this.VideoPlayer.nativeElement.play();
    });
  }

  private shareSelfie() {
    camera
      .takePicture({
        width: 1000,
        height: 1000
      })
      .then(imageAsset => {
        new ImageSource().fromAsset(imageAsset).then(imageSource => {
          this.Selfie.nativeElement.imageSource = imageSource;
          this.showImage = true;
          this.zone.run(() => (this.spokenText = ""));
          SocialShare.shareImage(imageSource);
        });
      });
  }

  private showDirections() {
    this.directions
      .navigate({
        from: {
          address: "RAI Amsterdam"
        },
        to: [
          {
            address: "Station Gouda"
          }
        ]
      })
      .then(
        () => {
          console.log("Maps app launched.");
        },
        error => {
          console.log(error);
        }
      );
  }

  getWeather(aSearch: string) {
    this.weatherService.getWeather(aSearch.toLowerCase()).then(res => {
      let weather: any = res;
      console.log(JSON.stringify(weather));
      // let colors = weather.color.split(",");
      let text = `The current weather in ${weather.city} (${weather.country}) is ${weather.summary.toLowerCase()}, ${
        weather.temperature
      } degrees Celcius. `;
      if (weather.apparentTemperature !== weather.temperature) {
        text += `But it feels like ${weather.apparentTemperature} degrees Celcius. `;
      }
      text += `The forecast is ${weather.forcast.toLowerCase()}`;
      this.speak(text);
    });
  }
}
