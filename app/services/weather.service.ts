// Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class WeatherService {
  apiUrl = "https://api.darksky.net/forecast/ae683ab899c629d358c4fa9c91cab429/";

  cities = [
    { name: "amsterdam", country: "the netherlands", latitude: 52.3702157, longitude: 4.8951679 },
    { name: "brugge", country: "belgium", latitude: 51.209348, longitude: 3.2246995 },
    { name: "ghent", country: "belgium", latitude: 51.0543422, longitude: 3.7174243 },
    { name: "hamburg", country: "germany", latitude: 53.5510846, longitude: 9.9936819 },
    { name: "munich", country: "germany", latitude: 48.1351253, longitude: 11.5819805 },
    { name: "odessa", country: "ukraine", latitude: 46.482526, longitude: 30.7233095 },
    { name: "sofia", country: "bulgaria", latitude: 42.6977082, longitude: 23.3218675 },
    { name: "vilnius", country: "lithuania", latitude: 54.6872, longitude: 25.2797 },
    { name: "gouda", country: "the netherlands", latitude: 52.0115205, longitude: 4.7104633 },
    { name: "lupin", country: "canada", latitude: 65.756673, longitude: -111.251274 },
    { name: "bandar-e mahshahr", country: "iran", latitude: 30.5619807, longitude: 49.1727178 }
  ];
  constructor(private httpClient: HttpClient) {}

  getWeather(search) {
    let city = this.cities.find(function(el) {
      return el.name == search || el.country == search;
    });
    console.log(JSON.stringify(city));
    return new Promise(resolve => {
      let params = city.latitude + "," + city.longitude;
      this.httpClient.get(this.apiUrl + params).subscribe(data => {
        data["city"] = city.name;
        data["country"] = city.country;
        resolve(data);
      });
    });
  }
}
