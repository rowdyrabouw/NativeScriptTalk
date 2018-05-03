import { Component, OnInit } from "@angular/core";

import { AddressOptions, Directions } from "nativescript-directions";

@Component({
  moduleId: module.id,
  selector: "app-directions",
  templateUrl: "directions.component.html"
})
export class DirectionsComponent implements OnInit {
  private directions: Directions;
  elevation = 2;

  constructor() {
    this.directions = new Directions();
  }

  ngOnInit() {}

  showDirections() {
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
}
