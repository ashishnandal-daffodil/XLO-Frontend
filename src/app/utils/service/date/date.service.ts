import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable({
  providedIn: "root"
})
export class DateService {
  constructor() {}

  handleCreatedOn(date) {
    let handledDate = null;
    let difference = moment().diff(moment(date), "days");
    if ([30, 31].includes(difference)) {
      handledDate = "A month ago";
    } else if (difference == 7) {
      handledDate = "A week ago";
    } else if (difference == 0) {
      handledDate = "Today";
    } else if (difference == 1) {
      handledDate = "Yesterday";
    } else if (difference > 1 && difference < 7) {
      handledDate = `${difference} days ago`;
    } else {
      handledDate = moment(date).format("DD MMM YY");
    }
    return handledDate;
  }
}
