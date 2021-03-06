import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { User } from '../models/user';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
const USER_DETAILS : any[] = [
    { "UserId": 101, "FirstName": "User 1", "LastName": "","EmployeeId" :10}
    ];

    const USER : User = new User();
export class MockUserService {
    public GetAllUsers(): Observable<User[]> {
      
        return Observable.of(USER_DETAILS);
      }

      public GetUser(): Observable<User> {
        return Observable.of(USER);
      }

      public AddUser(Item:User): Observable<string> {
        return Observable.of("Success");
      }

      public EditUser(Item:User, Id:number): Observable<string> {
        return Observable.of("Success");
      }

      public DeleteUser(Item:User): Observable<string> {
        return Observable.of("Success");
      }
}
