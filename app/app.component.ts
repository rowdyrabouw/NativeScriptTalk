import { Component, OnInit } from "@angular/core";
import { LanguageService } from "./services/language.service";

@Component({
  selector: "ns-app",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
  constructor(private _languageService: LanguageService) {}

  ngOnInit() {
    this._languageService.initLanguage();
  }
}
