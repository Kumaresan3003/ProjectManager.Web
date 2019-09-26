import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { TaskDetail } from '../models/task-detail';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

const USER : any =   { "UserId": 1, "FirstName": "User 1","lastName": "","employeeId" : 10  };
  const PROJECT : any =   { "ProjectId": 1, "ProjectName": "Project 1",
  "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10, "UserId" : 1, "EndTask" : true,
   "UserDetail" : USER };
 

  const TASK_DETAILS : any[] = [{ "id": 1, "name": "Task 1",  "Priority":10, 
      "EndTask":true, "ParentId":2, "ParentName":"parent", "UserDetail" : USER,"projectDetail" : PROJECT },
      { "id": 2, "name": "Task 2", "Priority":10, 
      "EndTask":false, "ParentId":2, "ParentName":"parent","UserDetail" : USER,"projectDetail" : PROJECT }
    ];    

  const TASK_DETAIL : TaskDetail = new TaskDetail();
export class MockTaskService {
    public GetAllTasks(): Observable<TaskDetail[]> {
        return Observable.of(TASK_DETAILS);
      }

      public GetParentList(): Observable<TaskDetail[]> {
        return Observable.of(TASK_DETAILS);
      }

      public GetTask(): Observable<TaskDetail> {
        return Observable.of(TASK_DETAILS[0]);
    }

      public AddTask(Item:TaskDetail): Observable<string> {
        return Observable.of("Success");
      }

      public PutTask(Item:TaskDetail, Id:number): Observable<string> {
        return Observable.of("Success");
      }
}
