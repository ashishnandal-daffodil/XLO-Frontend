import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { LocalStorageService } from '../utils/service/local.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  loggedInUser: object = null;
  
  constructor(
    public dialog: MatDialog,
    public localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem('loggedInUser')
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }
}