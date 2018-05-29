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
    this.checkAvailability();
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

  showBluetoothActionSheet() {
    dialogs
      .action({
        message: "Bluetooth",
        cancelButtonText: "Cancel",
        actions: ["Connect", "Disconnect"]
      })
      .then(result => {
        console.log("Dialog result: " + result);
        switch (result) {
          case "Connect":
            this.doConnectLightbulb();
            break;
          case "Disconnect":
            this.doDisconnectLightbulb();
            break;
        }
      });
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
      speak = "Hallo allemaal. Mijn naam is Diana. Het is geweldig om hier in Brugge te mogen zijn.";
      this.speakLocal(speak);
    } else if (text.indexOf("share") > -1 || text.indexOf("selfie") > -1) {
      speak = "That's a nice idea. Let's take a picture together and put it on Twitter!";
      this.speak(speak, "selfie");
      // } else if (text.indexOf("lights") > -1) {
      //   speak = "Oh Rowdy. You were born to light up the world!";
      //   this.speak(speak, "lightbulb");
      // } else if (text.indexOf("weather") > -1 && text.indexOf("here") > -1) {
      // if (!this.bluetoothConnected) {
      //   this.connectLightbulb(false);
      // }
      // this.getWeather("vilnius");
    } else if (text.indexOf("weather") > -1 && text.indexOf("hometown") > -1) {
      // if (!this.bluetoothConnected) {
      //   this.connectLightbulb(false);
      // }
      this.getWeather("gouda");
      // } else if (text.indexOf("weather") > -1 && text.indexOf("hot") > -1) {
      //   if (!this.bluetoothConnected) {
      //     this.connectLightbulb(false);
      //   }
      //   this.getWeather("karachi");
      // } else if (text.indexOf("weather") > -1 && text.indexOf("cold") > -1) {
      //   if (!this.bluetoothConnected) {
      //     this.connectLightbulb(false);
      //   }
      //   this.getWeather("lupin");
    } else if (text.indexOf("song") > -1 || text.indexOf("lyric") > -1) {
      speak =
        "Don't call it a comeback. I've been here for years. I'm rocking my peers. Puting suckers in fear. Making the tears rain down like a monsoon. Listen to the bass go boom!";
      this.speak(speak);
    } else if (text.indexOf("answer") > -1) {
      speak = "It's LL Cool J with Mama Said Knock You Out from the Deadpool 2 movie trailer.";
      this.speak(speak, "movie");
      // } else if (text.indexOf("show") > -1 || text.indexOf("cool") > -1) {
      //   speak = "That's a nice idea. Let's take a picture together and put it on Twitter!";
      //   this.speak(speak, "selfie");
      // } else if (text.indexOf("redecorate") > -1 || text.indexOf("house") > -1) {
      //   speak = "I've found a lovely small furniture store nearby, called eekayAh. Would you like some directions?";
      //   this.speak(speak);
    } else if (text.indexOf("chocolate") > -1 || text.indexOf("chocolates") > -1 || text.indexOf("year") > -1) {
      speak = "I remember it. You bought some nice Ecuador Dark 71% chocolate drops at Choco Story. Let's get some more.";
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
      locale: "en-US",
      finishedCallback: () => {
        if (aAction) {
          switch (aAction) {
            case "selfie":
              this.shareSelfie();
              break;
            case "lightbulb":
              this.connectLightbulb(true);
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
      locale: "nl-BE",
      finishedCallback: () => {}
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
          address: "Vaartdijkstraat 5, Brugge"
        },
        to: [
          {
            address: "Wijnzakstraat 2, Brugge"
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

  private connectLightbulb(showColors: boolean) {
    bluetooth.isBluetoothEnabled().then(function(enabled) {
      console.log("Enabled? " + enabled);
    });

    bluetooth
      .startScanning({
        serviceUUIDs: [],
        seconds: 4,
        skipPermissionCheck: true,
        onDiscovered: peripheral => {
          console.log("Periperhal found with UUID: " + peripheral.UUID);
          if (peripheral.UUID == this.uuid) {
            bluetooth.stopScanning().then(function() {
              console.log("scanning stopped");
            });
            bluetooth.connect({
              // UUID: this.uuid,
              UUID: peripheral.UUID,
              onConnected: peripheral => {
                this.bluetoothConnected = true;
                console.log("Periperhal connected with name: " + peripheral.name);
                // console.log("Periperhal connected with UUID: " + peripheral.UUID);
                // the peripheral object now has a list of available services:
                // peripheral.services.forEach(function(service) {
                //   console.log("service found: " + JSON.stringify(service));
                // });
                this.clearLightbulb();
                if (showColors) {
                  this.randomColors();
                }
              },
              onDisconnected: peripheral => {
                this.bluetoothConnected = false;
                console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
              }
            });
          }
        }
      })
      .then(
        () => {
          console.log("scanning complete");
        },
        function(err) {
          console.log("error while scanning: " + err);
        }
      );
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

  private randomColors() {
    let i = 0;
    let id = setInterval(() => {
      if (i < 10) {
        this.randomColor();
      }
      i++;
      if (i > 10) {
        clearInterval(id);
        this.clearLightbulb();
      }
    }, 1000);
  }

  private randomColor() {
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

  doConnectLightbulb() {
    this.connectLightbulb(false);
  }

  doDisconnectLightbulb() {
    this.clearLightbulb();
    this.disConnectLightbulb();
  }

  getWeather(aSearch: string) {
    this.weatherService.getWeather(aSearch.toLowerCase()).then(res => {
      let weather: any = res;
      console.log(JSON.stringify(weather));
      let colors = weather.color.split(",");
      this.setColor(colors[0], colors[1], colors[2]);
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
