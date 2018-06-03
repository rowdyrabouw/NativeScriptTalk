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
  canConnect: boolean = false;
  isConnected: boolean = false;

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
        // console.log("Periperhal found with advertisement: " + peripheral.advertisement);

        var newDevice = new MipDevice(peripheral.UUID, peripheral.name, peripheral.state);
        deviceFound(newDevice);
        this.canConnect = true;
      }
    });
  }

  // public getPermissions() {
  //   this.scanner.initialisePermissionsIfRequired();
  // }

  public connect(args) {
    // console.log("args: " + args.index);
    var mipDevice: MipDevice = this.devicesAround.getItem(0);
    // mipDevice.connect(this.onDisconnected)
    mipDevice.connect(() => {}).then(UUID => {
      this.isConnected = true;
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
    this.isConnected = false;
    AllMips.removeMip(mip);
  }

  doControls() {
    this.routerExtensions.navigate(["/mip/controls"]);
  }
}
