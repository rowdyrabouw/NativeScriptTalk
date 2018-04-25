import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

// for ngx-translate
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { LanguageService } from "./services/language.service";

// for ngx-translate AoT compilation
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "/i18n/", ".json");
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptHttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        deps: [HttpClient],
        useFactory: createTranslateLoader
      }
    })
  ],
  declarations: [AppComponent],
  providers: [LanguageService],
  schemas: [NO_ERRORS_SCHEMA]
})

export class AppModule {}
