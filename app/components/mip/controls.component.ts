import { Component } from "@angular/core";
import { AllMips } from "./all-mips";
import { startAccelerometerUpdates, stopAccelerometerUpdates } from "nativescript-accelerometer";

@Component({
  moduleId: module.id,
  selector: "mip-arrows",
  templateUrl: "controls.component.html",
  styleUrls: ["mip.css"]
})
export class ControlsComponent {
  intervalId: number;
  isWinking: boolean = false;
  soundIndex: number = 0;
  isJetMode: boolean = false;

  private _speed: number = 24;
  get speed() {
    return this._speed;
  }
  set speed(val: number) {
    this._speed = Math.round(val);
  }

  private _turnSpeed: number = 16;
  get turnSpeed() {
    return this._turnSpeed;
  }
  set turnSpeed(val: number) {
    this._turnSpeed = Math.round(val);
  }

  public moveForward() {
    AllMips.moveForward(this.speed);
  }

  public moveBack() {
    AllMips.moveBack(this.speed);
  }

  public turnLeft() {
    AllMips.turnLeft(this.speed, this.turnSpeed);
  }

  public turnRight() {
    AllMips.turnRight(this.speed, this.turnSpeed);
  }

  constructor() {}

  public startAccelerometer() {
    this.isJetMode = !this.isJetMode;
    console.log("isJetMode", this.isJetMode);
    if (this.isJetMode) {
      startAccelerometerUpdates(data => {
        this.turnSpeed = data.x; // lean left (0 to -1) / right (0 to 1)
        this.speed = data.y; // lean forward (0 to -1) / back (0 to 1)
      });
      this.startContinousMove();
    }
  }

  public startContinousMove() {
    setInterval(() => {
      AllMips.drive(this.speed, this.turnSpeed);
    }, 50);
  }

  private _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  doSound() {
    // const sounds = [3, 2, 41];
    const sounds = [2, 41];
    let sound = sounds[this.soundIndex];
    this.soundIndex++;
    if (this.soundIndex >= sounds.length) {
      this.soundIndex = 0;
    }
    AllMips.playOneSound(sound, 0, 0);
  }

  // doRandomSound() {
  //   let soundIndex = this._getRandomInt(1, 106); // value from 1 - 106
  //   AllMips.playOneSound(soundIndex, 0, 0);
  // }

  // doRandomColor() {
  //   const colors = [[255, 0, 0], [255, 128, 0], [], [], [], [], [], [], [], [], []];
  //   let red = this._getRandomInt(0, 255);
  //   let green = this._getRandomInt(0, 255);
  //   let blue = this._getRandomInt(0, 255);
  //   AllMips.setChestLED(red, green, blue);
  // }

  doColor() {
    const colors = [
      { color: "255, 0, 0" },
      { color: "255, 128, 0" },
      { color: "255, 255, 0" },
      { color: "128, 255, 0" },
      { color: "0, 255, 0" },
      { color: "0, 255, 128" },
      { color: "0, 255, 255" },
      { color: "0, 128, 255" },
      { color: "0, 0, 255" },
      { color: "128, 0, 255" },
      { color: "255, 0, 128" }
    ];
    let i = 0;
    this.intervalId = setInterval(() => {
      if (i < colors.length) {
        // console.log(colors[i].color);
        let color = colors[i].color.split(",");
        let red = parseInt(color[0]);
        let green = parseInt(color[1]);
        let blue = parseInt(color[2]);
        AllMips.setChestLED(red, green, blue);
      }
      i++;
      if (i > colors.length) {
        i = 0;
        // clearInterval(intervalId);
        // console.log("Chestlight stopped");
        // AllMips.setChestLED(255, 0, 0);
      }
    }, 300);
  }

  doWink() {
    AllMips.setHeadLED(2, 2, 0, 0);
  }
}
