import { ObservableArray } from "data/observable-array";
import { BluetoothScanner } from "nativescript-mip-ble/bluetooth.scanner";
import { MipDevice } from "nativescript-mip-ble/mip-device";
import { AllMips } from "./all-mips";
import { RouterExtensions } from "nativescript-angular/router";

import { Component } from "@angular/core";
let bluetooth = require("nativescript-bluetooth");

@Component({
  moduleId: module.id,
  selector: "mip-scan",
  templateUrl: "./scan.component.html",
  styleUrls: ["mip.css"]
})
export class ScanComponent {
  public scanner: BluetoothScanner;
  public devicesAround: ObservableArray<MipDevice>;

  constructor(private routerExtensions: RouterExtensions) {
    // this.scanner.initialisePermissionsIfRequired();

    this.devicesAround = new ObservableArray<MipDevice>();
  }

  scanForMip(deviceFound: (MipDevice) => any): Promise<any> {
    return bluetooth.startScanning({
      serviceUUIDs: [],
      seconds: 3,
      onDiscovered: peripheral => {
        if (peripheral.name === null || peripheral.name.indexOf("Mip") === -1) {
          // console.log(`Skipping a non mip device with UUID: ${peripheral.UUID} and name: ${peripheral.name}`);
          return;
        }

        console.log("");
        console.log("----New Device Found----");
        console.log("Periperhal found with UUID: " + peripheral.UUID);
        console.log("Periperhal found with name: " + peripheral.name);
        console.log("Periperhal found with advertisement: " + peripheral.advertisement);

        var newDevice = new MipDevice(peripheral.UUID, peripheral.name, peripheral.state);
        deviceFound(newDevice);
      }
    });
  }

  // public getPermissions() {
  //   this.scanner.initialisePermissionsIfRequired();
  // }

  public connect(args) {
    console.log("args: " + args.index);
    var mipDevice: MipDevice = this.devicesAround.getItem(args.index);
    // mipDevice.connect(this.onDisconnected)
    mipDevice.connect(() => {}).then(UUID => {
      AllMips.addMipDevice(mipDevice);
      AllMips.playOneSound(65, 0, 0);
      // alert("Device Connected");
    });
  }

  public scan() {
    this.devicesAround.splice(0);

    this.scanForMip((mip: MipDevice) => this.devicesAround.push(mip)).then(
      () => {
        // listView.notifyPullToRefreshFinished();
      },
      err => {
        // listView.notifyPullToRefreshFinished();
        alert("error while scanning: " + err);
      }
    );
  }

  private onDisconnected(mip: MipDevice) {
    AllMips.removeMip(mip);
  }

  private _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  doSound() {
    let soundIndex = this._getRandomInt(1, 106); // value from 1 - 106
    AllMips.playOneSound(soundIndex, 0, 0);
    // AllMips.setChestLED(255, 0, 0);
  }

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

  moveForward() {
    AllMips.moveForward(this.speed);
  }

  moveBack() {
    AllMips.moveBack(this.speed);
  }

  turnLeft() {
    AllMips.turnLeft(this.speed, this.turnSpeed);
  }

  turnRight() {
    AllMips.turnRight(this.speed, this.turnSpeed);
  }

  doColor() {
    let red = this._getRandomInt(0, 255);
    let green = this._getRandomInt(0, 255);
    let blue = this._getRandomInt(0, 255);
    AllMips.setChestLED(red, green, blue);
  }

  doWink() {
    AllMips.setHeadLED(2, 2, 0, 0);
  }

  doControls() {
    this.routerExtensions.navigate(["/mip/controls"]);
  }
}
