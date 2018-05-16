// Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Weather } from "../models/weather";

@Injectable()
export class WeatherService {
  apiUrl = "https://api.darksky.net/forecast/ae683ab899c629d358c4fa9c91cab429/";
  cities = [
    { name: "Amsterdam", country: "The Netherlands", latitude: 52.3702157, longitude: 4.8951679 },
    { name: "Brugge", country: "Belgium", latitude: 51.209348, longitude: 3.2246995 },
    { name: "Ghent", country: "Belgium", latitude: 51.0543422, longitude: 3.7174243 },
    { name: "Hamburg", country: "Germany", latitude: 53.5510846, longitude: 9.9936819 },
    { name: "Munich", country: "Germany", latitude: 48.1351253, longitude: 11.5819805 },
    { name: "Odessa", country: "Ukraine", latitude: 46.482526, longitude: 30.7233095 },
    { name: "Sofia", country: "Bulgaria", latitude: 42.6977082, longitude: 23.3218675 },
    { name: "Vilnius", country: "Lithuania", latitude: 54.6872, longitude: 25.2797 },
    { name: "Gouda", country: "The Netherlands", latitude: 52.0115205, longitude: 4.7104633 },
    { name: "Lupin", country: "Canada", latitude: 65.756673, longitude: -111.251274 },
    { name: "Bandar-e Mahshahr", country: "Iran", latitude: 30.5619807, longitude: 49.1727178 }
  ];

  constructor(private httpClient: HttpClient) {}

  private hsvToRgb(h, s, v): string {
    // https://gist.github.com/eyecatchup/9536706
    var r, g, b;
    var i;
    var f, p, q, t;

    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;

    if (s == 0) {
      // Achromatic (grey)
      r = g = b = v;
      return Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255);
    }

    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;

      case 1:
        r = q;
        g = v;
        b = p;
        break;

      case 2:
        r = p;
        g = v;
        b = t;
        break;

      case 3:
        r = p;
        g = q;
        b = v;
        break;

      case 4:
        r = t;
        g = p;
        b = v;
        break;

      default:
        // case 5:
        r = v;
        g = p;
        b = q;
    }
    return Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255);
  }

  private convertFtoC(temperature) {
    // Fahrenheit -> Celcius
    return Math.round((temperature - 32) * 5 / 9);
  }

  private getWeatherColor(temperature): string {
    // Fahrenheit
    // console.log(temperature);
    let hue = 200 - 160 * (Math.round(temperature) / 75);
    // console.log(hue);
    // console.log(this.hsvToRgb(hue, 100, 100));
    return this.hsvToRgb(hue, 100, 100);
  }

  getWeather(search) {
    let city = this.cities.find(function(el) {
      return el.name.toUpperCase() == search.toUpperCase() || el.country.toUpperCase() == search.toUpperCase();
    });
    return new Promise(resolve => {
      let params = city.latitude + "," + city.longitude;
      this.httpClient.get(this.apiUrl + params).subscribe(res => {
        let data: any = res;
        let weather = new Weather();
        weather.city = city.name;
        weather.country = city.country;
        weather.temperature = this.convertFtoC(data.currently.temperature);
        weather.apparentTemperature = this.convertFtoC(data.currently.apparentTemperature);
        weather.summary = data.currently.summary;
        weather.forcast = data.hourly.summary;
        weather.color = this.getWeatherColor(data.currently.apparentTemperature);
        resolve(weather);
      });
    });
  }
}
