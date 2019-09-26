import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskmgrViewComponent } from './taskmgr-view.component';
import { ProjectService } from '../../SharedService/project.service';
import { MockProjectService } from '../../SharedService/mock-project-service';
import { TaskService } from '../../SharedService/task.service';
import { MockTaskService } from '../../SharedService/mock-task-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskDetail } from '../../models/task-detail';
import { Project } from '../../models/project';
import { Router,ActivatedRoute} from '@angular/router';
import { ProjectNameSearchPipe } from '../../pipes/project-name-search.pipe'
import { TaskmgrSortPipe } from '../../pipes/taskmgr-sort.pipe'
import { DatePipe } from '@angular/common';

describe('TaskmgrViewComponent', () => {
  let component: TaskmgrViewComponent;
  let fixture: ComponentFixture<TaskmgrViewComponent>;
 
  let taskService : TaskService; 
  let projectService : ProjectService; 
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')  
  };

  const PROJECT : any =   { "ProjectId": 1, "ProjectName": "Project 1",
  "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10, "UserId" : 1, "EndTask" : true
   };

   const PROJECT1 : any =   { "ProjectId": 2, "ProjectName": "Project 2",
   "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10, "UserId" : 1, "EndTask" : true
    };
 

  const TASK_DETAILS : any[] = [{ "id": 1, "name": "Task 1", "StartDate": Date.now, 
  "EndDate" :Date.now, "Priority":10, 
      "EndTask":true, "ParentId":2, "ParentName":"parent", "projectDetail" : PROJECT },
      { "id": 2, "name": "Task 2", "StartDate": Date.now, "EndDate" :Date.now, "Priority":10, 
      "EndTask":false, "ParentId":2, "ParentName":"parent","projectDetail" : PROJECT1 }
    ];    

    const PROJECTS : any[] = [
      { "ProjectId": 1, "ProjectName": "Project 1",
      "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10, "UserId" : 1, "EndTask" : true
       },
      { "ProjectId": 2, "ProjectName": "Project 2",
      "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":20, "UserId" : 1, "EndTask" : false
        }
    ];


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule],
      declarations: [ TaskmgrViewComponent, ProjectNameSearchPipe,TaskmgrSortPipe ],
      providers: [
         {provide: TaskService, useClass: MockTaskService},       
        {provide: ProjectService, useClass: MockProjectService},
        { provide: ActivatedRoute, useValue: { 'queryParams': Observable.from([{ 'id': 101 }]) } },
        { provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmgrViewComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TaskService);
    projectService = TestBed.get(ProjectService);
    fixture.detectChanges();
  });
});
