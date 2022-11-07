import { Injectable } from "@angular/core";
import * as countrycitystatejson from "countrycitystatejson";

@Injectable({
  providedIn: "root"
})
export class LocationService {
  constructor() {}

  private countryData = countrycitystatejson;

  getCountries() {
    return this.countryData.getCountries();
  }

  getStatesByCountry(countryShotName: string) {
    return this.countryData.getStatesByShort(countryShotName);
  }

  getCitiesByState(country: string, state: string) {
    return this.countryData.getCities(country, state);
  }
}
