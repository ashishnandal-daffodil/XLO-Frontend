import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { LocalStorageService } from '../utils/service/local.service';
import { HttpService } from '../utils/service/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  loggedInUser: object = null;
  
  constructor(
    public dialog: MatDialog,
    public localStorageService: LocalStorageService,
    public httpService: HttpService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItem('loggedInUser');
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  logOut() {
    let body = {
      token: this.localStorageService.getItem('auth')
    };
    this.httpService.postRequest(`users/logout`, body).subscribe(
      res => {
        this.handleLogout(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  handleLogout(res) {
    this.localStorageService.clearLocalStorage();
    this.router.navigateByUrl('/').then(()=>{
      window.location.reload();
    });
  }
}