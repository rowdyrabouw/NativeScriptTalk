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

@Component({
  moduleId: module.id,
  selector: "Speech",
  templateUrl: "speechrecognition.component.html"
})
export class SpeechRecognitionComponent implements OnInit {
  // lightbulb
  private uuid = "2B:C8:4B:16:AC:E6";
  private service = "ff0f";
  private characteristic = "fffc";
  private weather;

  private text2speech: TNSTextToSpeech;
  private speechRecognition: SpeechRecognition;
  private directions: Directions;
  recognizedText: string;
  image: string;
  @ViewChild("videoplayer") VideoPlayer: ElementRef;
  isVideoVisible: boolean = false;

  constructor(private weatherService: WeatherService, private zone: NgZone) {}

  ngOnInit() {
    this.text2speech = new TNSTextToSpeech();
    this.speechRecognition = new SpeechRecognition();
    this.directions = new Directions();
    this.checkAvailability();
    camera.requestPermissions();
  }

  private checkAvailability(): void {
    this.speechRecognition
      .available()
      .then
      // (available: boolean) => alert(available ? "SpeechRecognition is available" : "SpeechRecognition is NOT available!"),
      // (err: string) => console.log(err)
      ();
    bluetooth.isBluetoothEnabled().then(function(enabled) {
      // dialogs.alert(enabled ? "Bluetooth is available" : "Bluetooth is NOT available!");
    });
  }

  startListening() {
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
      speak = "Sveiki visi. Puiku būti čia Vilnius. Tęskime anglų kalbą, taigi Rowdy taip pat gali tai suvokti.";
      this.speak(speak);
    } else if (text.indexOf("character") > -1 || text.indexOf("marvel") > -1) {
      speak =
        "My name is Ororo Munroe. My mother was a tribal princess of Kenya and my father ws an American photojournalist. I better known as Storm, an X-men. I can control the weather. How cool is that?";
      this.speak(speak);
    } else if (text.indexOf("show") > -1 || text.indexOf("cool") > -1) {
      speak = "Let's watch a little video of my character together! Please make sure to rotate your device to landscape.";
      this.speak(speak, "movie");
    } else if (text.indexOf("share") > -1 || text.indexOf("selfie") > -1) {
      speak = "That's a nice idea. Let's take a picture together and put it on Twitter!";
      this.speak(speak, "selfie");
    } else if (text.indexOf("redecorate") > -1 || text.indexOf("house") > -1) {
      speak = "I've found a lovely small furniture store nearby, called eekayAh. Would you like some directions?";
      this.speak(speak);
    } else if (text.indexOf("yes") > -1 || text.indexOf("please") > -1) {
      speak = "It's nearby, see for yourself.";
      this.speak(speak, "directions");
    }
  }

  private speak(aText: string, aAction?: string) {
    let speakOptions: SpeakOptions = {
      text: aText,
      speakRate: 0.8,
      pitch: 1.2,
      locale: "en-US",
      finishedCallback: () => {
        if (aAction) {
          switch (aAction) {
            case "movie":
              this.isVideoVisible = true;
              this.showMovie();
              break;
            case "selfie":
              this.shareSelfie();
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

  private showMovie() {
    dialogs.confirm("Rotate!").then(result => {
      this.zone.run(() => (this.isVideoVisible = true));

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
          SocialShare.shareImage(imageSource);
        });
      });
  }

  private showDirections() {
    this.directions
      .navigate({
        from: {
          address: "Radisson Blu Waterfront Hotel, Stockholm"
        },
        to: [
          {
            address: "Regeringsgatan 65, 111 56 Stockholm, Sweden"
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

  private connectLightbulb() {
    bluetooth.connect({
      UUID: this.uuid,
      onConnected: peripheral => {
        console.log("Periperhal connected with UUID: " + peripheral.UUID);

        // the peripheral object now has a list of available services:
        peripheral.services.forEach(function(service) {
          // console.log("service found: " + JSON.stringify(service));
        });

        this.clearLightbulb();
      },
      onDisconnected: function(peripheral) {
        console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
      }
    });
  }

  private clearLightbulb() {
    this.setColor(0, 0, 0);
  }

  private disConnectLightbulb() {
    bluetooth
      .disconnect({
        UUID: this.uuid
      })
      .then(
        function() {
          console.log("disconnected successfully");
        },
        function(err) {
          // in this case you're probably best off treating this as a disconnected peripheral though
          console.log("disconnection error: " + err);
        }
      );
  }

  randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    this.setColor(r, g, b);
  }

  private setColor(r, g, b) {
    let value = new Uint8Array([0x00, r, g, b]);
    this.write(value);
  }

  private write(value) {
    bluetooth
      .writeWithoutResponse({
        peripheralUUID: this.uuid,
        serviceUUID: this.service,
        characteristicUUID: this.characteristic,
        value: value
      })
      .then(
        function(result) {
          // console.log("value written");
        },
        function(err) {
          console.log("write error: " + err);
        }
      );
  }

  doInfinityStones() {
    const stones = [
      { name: "the space stone", color: "0,255,255" },
      { name: "mind stone", color: "255,255,0" },
      { name: "reality stone", color: "255,0,0" },
      { name: "soul stone", color: "255,75,0" },
      { name: "power stone", color: "255,0,255" },
      { name: "and the time stone", color: "0,255,0" }
    ];
    let i = -1;
    let id = setInterval(() => {
      if (i < 0) {
        this.speak("Oh mighty Rowdy, here are they!");
      } else if (i < stones.length) {
        // console.log(stones[i].name);
        let colors = stones[i].color.split(",");
        this.setColor(colors[0], colors[1], colors[2]);
        this.speak(stones[i].name);
      }
      i++;
      if (i > stones.length) {
        clearInterval(id);
        this.clearLightbulb();
      }
    }, 3000);
  }

  doConnectLightbulb() {
    this.connectLightbulb();
  }

  doDisconnectLightbulb() {
    this.clearLightbulb();
    this.disConnectLightbulb();
  }

  getWeather(aSearch: string) {
    this.weatherService.getWeather(aSearch.toLowerCase()).then(res => {
      this.weather = res;
      console.log(JSON.stringify(this.weather));
      console.log("city", this.weather.city);
      let tempCelcius = Math.round((this.weather.currently.temperature - 32) * 5 / 9);
      let apparentTempCelcius = Math.round((this.weather.currently.apparentTemperature - 32) * 5 / 9);
      let text = `The current weather in ${this.weather.city} (${this.weather.country}) 
                  is ${this.weather.currently.summary}, 
                  ${tempCelcius} degrees Celcius. `;
      if (apparentTempCelcius !== tempCelcius) {
        text += `But it feels like ${apparentTempCelcius} degrees Celcius. `;
      }
      text += `And it will be ${this.weather.hourly.summary}`;
      this.speak(text);
    });
  }
}
