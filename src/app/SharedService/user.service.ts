import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do';
import { User } from '../models/user';

@Injectable()
export class UserService {
  baseUrl: string ="http://localhost/api/user/";  
  constructor(private http:Http) { }

  GetAllUsers():Observable<User[]>
  {   
    console.log('user service called');
    
      return this.http.get(this.baseUrl).map((data:Response)=><User[]>data.json());      
  }

  GetUser(Id:number):Observable<User>
  {   
      return this.http.get(this.baseUrl+Id).map((data:Response)=><User>data.json())     
  }

  AddUser(Item:User):Observable<string>
    {
        return this.http.post(this.baseUrl,Item)
        .map((data:Response)=><string>data.json())
    }

    EditUser(Item:User, Id:number):Observable<string>
    {
      return this.http.put(this.baseUrl+Id,Item)
      .map((data:Response)=><string>data.json())
    }

    DeleteUser(Id:number):Observable<string>
    {
      return this.http.delete(this.baseUrl+Id)
      .map((data:Response)=><string>data.json())
    }

  private extractResponse(response: Response) {
    if (response.status < 200 || response.status >= 300) {
       throw new Error('Bad response status: ' + response.status);
    }
    let body = response.json(); // parse JSON string into JavaScript objects

    return body || { };
  }    
}
