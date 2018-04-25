import { Component } from "@angular/core";

import { LanguageService } from "../../services/language.service";

@Component({
  selector: "app-home",
  moduleId: module.id,
  templateUrl: "./home.component.html"
})
export class HomeComponent {
  constructor(private languageService: LanguageService) {}

  changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
}
