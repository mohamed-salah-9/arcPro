import { Injectable } from '@angular/core';
import { Admin } from './../models/admins';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.Url;

@Injectable({
  providedIn: 'root'
})
export class AdminsService {
  APIURL = BACKEND_URL + 'admin/';
  API = BACKEND_URL + 'admins/';
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  admin: Observable<Admin>

  constructor(private http: HttpClient, private router: Router) {

  }

  addadmin(admin: Admin) {
    return this.http.post(this.APIURL, admin);
  }
  deleteadminById(id: string) {
    return this.http.delete(this.APIURL + id);
  }
  getadmin_byId(id: string) {
    return this.http.get<Admin>(this.APIURL + id);
  }
  updateadmin_ById(id: string, admin: any) {
    return this.http.patch(this.APIURL + id, admin);
  }
  updateadmin_image(admin: any) {
    return this.http.patch(this.API + 'update', admin);
  }
  getadmins() {
    return this.http.get<Admin[]>(this.APIURL);
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  loggedin() {
    return !!localStorage.getItem('token')
  }

  getToken() {
    let token = localStorage.getItem('token')
    return token;
  }

  login(admin: string) {
    return this.http.post<{ admin: Admin, token: string }>(
      this.APIURL + "login",
      admin
    )
      .pipe(map(admin => {
        if (admin && admin.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', admin.token)
        }

        return admin;
      }));
  }
  logout() {
    localStorage.removeItem("token");

    this.router.navigate(["/"]);
  }


  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);

  }

  private clearAuthData() {
    localStorage.removeItem("token");

  }

  private getAuthData() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }
    return {
      token: token,
    };
  }
  getprofile() {
    return this.http.get<Admin[]>(this.APIURL + 'me');

  }
  requestReset(admin: Admin) {
    return this.http.post<{ admin: Admin }>(BACKEND_URL + 'req-reset-password', admin);
  }

  newPassword(body): Observable<any> {
    return this.http.post(BACKEND_URL + 'new-password/', body);
  }

  ValidPasswordToken(body): Observable<any> {
    return this.http.post(BACKEND_URL + 'valid-password-token/', body);
  }


}

