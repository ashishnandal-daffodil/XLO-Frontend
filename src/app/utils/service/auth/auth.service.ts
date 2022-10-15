import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginResponseI } from 'src/app/model/login-response.interface';
import { User } from 'src/app/model/user.interface';
import { LocalStorageService } from '../localStorage/local.service';
import { SnackbarService } from '../snackBar/snackbar.service';
import { successMessages } from '../../helpers/success-messages';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar, private jwtService: JwtHelperService, private localStorageService: LocalStorageService, private snackBarService: SnackbarService) { }

  login(user: User): Observable<LoginResponseI> {
    return this.http.post<LoginResponseI>('users/login', user).pipe(
      tap((res: LoginResponseI) => this.localStorageService.setAccessToken(res.body.token)),
      tap(() => this.snackBarService.open(successMessages.NEW_ACCOUNT_CREATED_SUCCESS, "success"))
    );
  }

  getLoggedInUser() {
    const decodedToken = this.jwtService.decodeToken();
    return decodedToken.user;
  }
}
