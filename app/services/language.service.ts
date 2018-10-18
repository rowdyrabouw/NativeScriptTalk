// Platform
// Angular
import { Injectable } from "@angular/core";
// Plugins
import { TranslateService } from "@ngx-translate/core";
import * as Platform from "platform";



@Injectable()
export class LanguageService {
  private languages: Array<string> = ["en", "de"];
  private language: string = "en";

  translateService: TranslateService;

  constructor(private translate: TranslateService) {
    let deviceLanguage: string = Platform.device.language;
    let languageIndex = this.languages.indexOf(deviceLanguage);
    if (languageIndex >= 0) {
      this.language = deviceLanguage;
    }
  }

  initLanguage() {
    this.translateService = this.translate;
    this.translate.addLangs(this.languages);
    this.translate.use(this.language);
  }

  setLanguage(aTaal: string) {
    this.language = aTaal;
    this.translate.use(aTaal);
  }
}
