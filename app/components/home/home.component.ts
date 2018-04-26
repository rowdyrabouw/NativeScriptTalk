import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

import { TNSPlayer } from "nativescript-audio";

import { LanguageService } from "../../services/language.service";

@Component({
  selector: "app-home",
  moduleId: module.id,
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  private player: TNSPlayer;

  constructor(private routerExtensions: RouterExtensions, private languageService: LanguageService) {}

  ngOnInit() {
    this.player = new TNSPlayer();
    this.player.initFromFile({
      audioFile: "~/assets/audio/testing.mp3",
      loop: false
    });
  }

  changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }

  testAudio() {
    if (this.player.isAudioPlaying()) {
      this.player.seekTo(0);
      this.player.pause();
    } else {
      this.player.play();
    }
  }
  navigateSlider() {
    this.routerExtensions.navigate(["/slider"]);
  }

  navigateSpeechRecognition() {
    this.routerExtensions.navigate(["/speechrecognition"]);
  }

  navigateGuessThatSong() {
    this.routerExtensions.navigate(["/guess"]);
  }
}
