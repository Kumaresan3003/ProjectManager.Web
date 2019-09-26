import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAddComponent } from './project-add.component';
import { ProjectService } from '../../SharedService/project.service';
import { MockProjectService } from '../../SharedService/mock-project-service';
import { UserService } from '../../SharedService/user.service';
import { MockUserService } from '../../SharedService/mock-user-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { FormsModule }   from '@angular/forms';
import { User } from '../../models/user';
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { UsersSearchPipe } from '../../pipes/users-search.pipe'
import { Project } from '../../models/project';

describe('ProjectAddComponent', () => {
  let component: ProjectAddComponent;
  let fixture: ComponentFixture<ProjectAddComponent>;
  let service : ProjectService; 
  let userService : UserService; 

  const TASK_DETAILS : any[] = [
    { "id": 101, "name": "Task 101", "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10,"EndProject":true, "ParentId":null, "ParentName":null },
    { "id": 102, "name": "Task 102", "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10,"EndProject":false, "ParentId":null, "ParentName":null },
    { "id": 103, "name": "Task 103", "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10,"EndProject":false, "ParentId":102, "ParentName":null },
    { "id": 104, "name": "Task 104", "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10,"EndProject":true, "ParentId":101, "ParentName":null},
    ];

    
  const USERS : any[] = [
    { "UserId": 1, "firstName": "User 1","lastName": "","employeeId" : 10  },
    { "UserId": 2, "firstName": "User 2","lastName": "","employeeId" : 20  }
  ];

  const PROJECTS : any[] = [
    { "ProjectId": 1, "ProjectName": "Project 1",
    "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":10, "UserId" : 1, "EndProject" : true,
    "TaskDetails" : TASK_DETAILS, "UserDetail" : USERS[0] },
    { "ProjectId": 2, "ProjectName": "Project 2",
    "StartDate": "2018-07-23","EndDate" :"2018-07-28", "Priority":20, "UserId" : 1, "EndProject" : true ,
     "TaskDetails" : TASK_DETAILS, "UserDetail" : USERS[1]  }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule],
      declarations: [ ProjectAddComponent,UsersSearchPipe ],
      providers: [
        {provide: ProjectService, useClass: MockProjectService} ,
        {provide: UserService, useClass: MockUserService}      
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAddComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ProjectService);
    userService = TestBed.get(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should return false when project details are invalid for submit', () =>
  {
    component.project = new Project();
    var result = component.onValidate();
    expect(result).toBe(true);

    component.project.ProjectName = "project 1";
    var result = component.onValidate();
    expect(result).toBe(true);

    component.project.UserDetail = new User();
    component.enableDate = true;  
    var EndDate = new Date();
    EndDate.setDate(new Date().getDate() + 1);  
    component.project.StartDate =  new Date();
    component.project.EndDate = EndDate;
    
    var result = component.onValidate();
    expect(result).toBe(false);
  });

  it('Add should return validation alert', () =>
  {
    component.project = new Project();
    component.project.UserDetail = new User();
    component.enableDate = true;  
    var EndDate = new Date();
    EndDate.setDate(new Date().getDate() + 1);  
    component.project.StartDate = EndDate;
    component.project.EndDate = new Date();

    spyOn(window,'alert').and.stub();
    
    component.projectsToView = []; 
    var result = component.onAddProject();
   
    expect(result).toBe(false);
  });

  it('Add should return Success', () =>
  {
    component.project = new Project();
    component.project.UserDetail = new User();
    component.enableDate = false;  
    spyOn(service,'AddProject').and.returnValue(Observable.of("1"));
    spyOn(service,'GetAllProjects').and.returnValues(Observable.of(PROJECTS));
    spyOn(component,"onResetProject").and.stub();
    component.projectsToView = []; 
    component.onAddProject();
   
    expect(true).toBe(component.success);
    expect(service.AddProject).toHaveBeenCalled();    
     
  });

  it('Update should return validation alert', () =>
  {
    component.project = new Project();
    component.project.UserDetail = new User();
    component.enableDate = true;  
    var EndDate = new Date();
    EndDate.setDate(new Date().getDate() + 1);  
    component.project.StartDate = EndDate;
    component.project.EndDate = new Date();
    spyOn(window,'alert').and.stub();    
    var result = component.onUpdateProject();
   
    expect(result).toBe(false);
  });

  it('Update should return Success', () =>
  {
    component.project = new Project();
    component.project.UserDetail = new User();
    component.enableDate = false;  
    spyOn(service,'EditProject').and.returnValue(Observable.of("1"));
    spyOn(service,'GetAllProjects').and.returnValues(Observable.of(PROJECTS));
    spyOn(component,"onResetProject").and.stub();
    component.projectsToView = []; 
    component.onUpdateProject();
   
    expect(component.success).toBe(true);
    expect(service.EditProject).toHaveBeenCalled();   
    expect(component.showUpdate).toBe(false);
    expect(component.showAdd).toBe(true);      
  });

  it('Should reset Project Object', () =>
  {
    var project = new Project();
    project.ProjectId = 1;
    component.project =  project;    
    component.onResetProject();    
    expect(undefined).toBe(component.project.ProjectId);
    expect(false).toBe(component.showUpdate);
    expect(true).toBe(component.showAdd);       
  });

  it('Should return users', () =>
  {
    spyOn(userService,'GetAllUsers').and.returnValues(Observable.of(USERS));
    component.onSearchManager();    
    expect(component.users.length).toBe(2);   
  });

  it('Should set manager name', () =>
  {
    var user = new User();
    user.UserId = 1001;
    user.FirstName ="firstname";
    user.LastName ="lastname";    
    component.onSelectManager(user);    
    expect(component.project.UserId).toBe(1001);   
    expect(component.managerName).toBe("firstname lastname");  
  });

  it('Should have been called onGetAllUsers', () =>
  {
    spyOn(userService,'GetAllUsers').and.returnValues(Observable.of(USERS));
    component.onGetAllUsers();    
    expect(component.users.length).toBe(2);   
    expect(userService.GetAllUsers).toHaveBeenCalled();  
  });  
});
