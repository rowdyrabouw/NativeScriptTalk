import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { StackLayout } from "ui/layouts/stack-layout";
import { Slider } from "ui/slider";
import { Page } from "ui/page";

import { TNSPlayer } from "nativescript-audio";

@Component({
  moduleId: module.id,
  selector: "nda-slider",
  templateUrl: "slider.component.html",
  styleUrls: ["slider.component.css"]
})
export class SliderComponent implements OnInit {
  @ViewChild("background") background: ElementRef;
  private viewStack: StackLayout;
  private player: TNSPlayer;

  constructor(private page: Page, private routerExtensions: RouterExtensions) {}

  navigateHome() {
    this.player.seekTo(0);
    this.player.pause();
    this.routerExtensions.navigate(["/"]);
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.viewStack = this.background.nativeElement;
    this.player = new TNSPlayer();
    this.player.initFromFile({
      audioFile: "~/assets/audio/captain.mp3",
      loop: false
    });
  }

  onSliderValueChange(args) {
    let slider = <Slider>args.object;
    let sliderValue = slider.value / 100;
    this.viewStack.opacity = sliderValue;
    if (Math.round(slider.value) > 0) {
      this.player.play();
      this.player.volume = sliderValue;
    } else {
      this.player.seekTo(0);
      this.player.pause();
    }
  }
}
