import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "extractNameInitials"
})
export class extractNameInitialsPipe implements PipeTransform {
  transform(name: string, maxLength: number): string {
    let initials = "";
    let nameSplit = name.split(" ");
    nameSplit.forEach((name, index) => {
      index < 2 ? (initials += name.charAt(0)) : null;
    });
    return initials.slice(0, maxLength);
  }
}
