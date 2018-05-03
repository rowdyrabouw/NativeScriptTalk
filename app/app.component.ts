import { Component, OnInit } from "@angular/core";
import { LanguageService } from "./services/language.service";

import { topmost } from "ui/frame";
import { isIOS } from "platform";

// Declare these so the TypeScript compiler doesn’t complain about these references.
declare var UIImage: any;
declare var UIBarMetrics: any;

@Component({
  selector: "ns-app",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.languageService.initLanguage();
    if (isIOS) {
      let navigationBar = topmost().ios.controller.navigationBar;
      navigationBar.translucent = false;
      navigationBar.setBackgroundImageForBarMetrics(UIImage.new(), UIBarMetrics.Default);
      navigationBar.shadowImage = UIImage.new();

      // navigationBar.barStyle = 0; // black
      navigationBar.barStyle = 1; // white
    }
  }
}
