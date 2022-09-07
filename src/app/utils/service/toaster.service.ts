import { Injectable } from "@angular/core";

@Injectable()
export class ToastService {
  public toaster: any = {
    show: false
  };
  constructor() {}

  /**
   * Function to show loader
   */
  showToaster() {
    this.toaster.show = true;
  }

  /**
   * Function to hide loader
   */
  hideToaster() {
    this.toaster.show = false;
  }
}
