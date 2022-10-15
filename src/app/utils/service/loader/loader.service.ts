import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LoaderService {
  public loader: any = {
    show: false
  };

  constructor() {}

  showLoader() {
    this.loader.show = true;
  }

  hideLoader() {
    this.loader.show = false;
  }
}
