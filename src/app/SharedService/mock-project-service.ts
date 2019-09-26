import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { Project } from '../models/project';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

    const TASK_DETAILS : any[] = [
      { "id": 101, "name": "Task 101", "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10,"EndProject":true, "ParentId":null, "ParentName":null },
      { "id": 102, "name": "Task 102", "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10,"EndProject":false, "ParentId":null, "ParentName":null },
      { "id": 103, "name": "Task 103", "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10,"EndProject":false, "ParentId":102, "ParentName":null },
      { "id": 104, "name": "Task 104", "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10,"EndProject":true, "ParentId":101, "ParentName":null},
      ];

    const USERS : any[] = [
      { "UserId": 1, "firstName": "User 1","LastName": "","employeeId" : 10  },
      { "UserId": 2, "firstName": "User 2","LastName": "","employeeId" : 20  }
    ];
  
    const PROJECT_DETAILS : any[] = [
      { "ProjectId": 1, "ProjectName": "Project 1",
      "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10, "UserId" : 1, "EndProject" : true,"TaskDetails" : TASK_DETAILS },
      { "ProjectId": 2, "ProjectName": "Project 2",
      "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":20, "UserId" : 1, "EndProject" : true , "TaskDetails" : TASK_DETAILS  }
    ];
    const PROJECT_DETAIL : Project = new Project();

export class MockProjectService {
    public GetAllProjects(): Observable<Project[]> {
     
        return Observable.of(PROJECT_DETAILS);
      }

      public GetProject(): Observable<Project> {
        return Observable.of(PROJECT_DETAIL);
      }

      public AddProject(Item:Project): Observable<string> {
        return Observable.of("Success");
      }

      public EditProject(Item:Project, Id:number): Observable<string> {
        return Observable.of("Success");
      }

      public DeleteProject(Item:Project): Observable<string> {
        return Observable.of("Success");
      }
}
