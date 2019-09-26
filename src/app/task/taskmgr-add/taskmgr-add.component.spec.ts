import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskmgrAddComponent } from './taskmgr-add.component';
import { ProjectService } from '../../SharedService/project.service';
import { MockProjectService } from '../../SharedService/mock-project-service';
import { UserService } from '../../SharedService/user.service';
import { MockUserService } from '../../SharedService/mock-user-service';
import { TaskService } from '../../SharedService/task.service';
import { MockTaskService } from '../../SharedService/mock-task-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskDetail } from '../../models/task-detail';
import { Project } from '../../models/project';
import { User } from '../../models/user';
import { Router,ActivatedRoute} from '@angular/router';
import { ProjectNameSearchPipe } from '../../pipes/project-name-search.pipe'
import { UsersSearchPipe } from '../../pipes/users-search.pipe'
import { TaskmgrSearchPipe } from '../../pipes/taskmgr-search.pipe'

describe('TaskmgrAddComponent', () => {
  let component: TaskmgrAddComponent;
  let fixture: ComponentFixture<TaskmgrAddComponent>;
  let userService : UserService; 
  let taskService : TaskService; 
  let projectService : ProjectService; 

  const USER : any =   { "UserId": 1, "firstName": "User 1","lastName": "","employeeId" : 10  };
  const PROJECT : any =   { "ProjectId": 1, "ProjectName": "Project 1",
  "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10, "UserId" : 1, "EndTask" : true,
   "UserDetail" : USER };
 

  const TASK_DETAILS : any[] = [{ "id": 1, "name": "Task 1", "StartDate": Date.now, 
  "EndDate" :Date.now, "Priority":10, 
      "EndTask":true, "ParentId":2, "ParentName":"parent", "UserDetail" : USER,"projectDetail" : PROJECT },
      { "id": 2, "name": "Task 2", "StartDate": Date.now, "EndDate" :Date.now, "Priority":10, 
      "EndTask":false, "ParentId":2, "ParentName":"parent","UserDetail" : USER,"projectDetail" : PROJECT }
    ];    

    const PROJECTS : any[] = [
      { "ProjectId": 1, "ProjectName": "Project 1",
      "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10, "UserId" : 1, "EndTask" : true
       },
      { "ProjectId": 2, "ProjectName": "Project 2",
      "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":20, "UserId" : 1, "EndTask" : true
        }
    ];

    const USERS : any[] = [
      { "UserId": 1, "firstName": "User 1","lastName": "","employeeId" : 10  },
      { "UserId": 2, "firstName": "User 2","lastName": "","employeeId" : 20  }
    ];
  
    

    let mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule],
      declarations: [ TaskmgrAddComponent,ProjectNameSearchPipe,UsersSearchPipe,TaskmgrSearchPipe ] , 
      providers: [
        {provide: TaskService, useClass: MockTaskService},
        {provide: UserService, useClass: MockUserService},
        {provide: ProjectService, useClass: MockProjectService},
        { provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmgrAddComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TaskService);
    projectService = TestBed.get(ProjectService);
    userService = TestBed.get(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Add should return Success', () =>
  {
    component.isParentTaskSelected = true;   
    spyOn(taskService,'AddTask').and.returnValue(Observable.of("1"));    
    spyOn(component,"openModal").and.stub();

    component.onAddTask();
   
    expect(component.results.length).toBeGreaterThan(0);
    expect(component.openModal).toHaveBeenCalled();         
  });

  it('onAddTaskNavigateToView modal should go to view', () =>
  {
    component.onAddTaskNavigateToView();     

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/viewTask']);
  })

});

