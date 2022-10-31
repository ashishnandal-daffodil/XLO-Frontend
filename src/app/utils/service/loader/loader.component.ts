import { Component, OnInit } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { LoaderService } from "./loader.service";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"]
})
export class LoaderComponent implements OnInit {
  public loader: any = {
    show: false
  };
  color: ThemePalette = "accent";

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loader = this.loaderService.loader;
  }
}
