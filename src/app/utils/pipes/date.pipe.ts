import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "customDate"
})
export class DatePipe implements PipeTransform {
  transform(date: string, showTime: boolean = false, showOnlyDate: boolean = false): string {
    let handledDate = null;
    if (showOnlyDate) {
      handledDate = moment(date).format("ll");
    } else {
      let difference = moment().diff(moment(date), "days");
      if ([30, 31].includes(difference)) {
        handledDate = "A month ago";
      } else if (difference == 7) {
        handledDate = "A week ago";
      } else if (difference == 0) {
        if (showTime) {
          handledDate = moment(date).format("LT");
        } else {
          handledDate = "Today";
        }
      } else if (difference == 1) {
        handledDate = "Yesterday";
      } else if (difference > 1 && difference < 7) {
        handledDate = `${difference} days ago`;
      } else {
        handledDate = moment(date).format("DD MMM YY");
      }
    }
    return handledDate;
  }
}
