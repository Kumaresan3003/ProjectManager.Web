import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Project } from '../../models/project';
import { TaskDetail } from '../../models/task-detail';
import { User } from '../../models/user';
import { ProjectService } from '../../SharedService/project.service';
import { TaskService } from '../../SharedService/task.service';
import { UserService } from '../../SharedService/user.service';
import { Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-taskmgr-add',
  templateUrl: './taskmgr-add.component.html',
  styleUrls: ['./taskmgr-add.component.css']
})
export class TaskmgrAddComponent implements OnInit {
  @ViewChild('showmodalClick') showmodalClick:ElementRef;
  @ViewChild('showParentTaskCheckbox') showParentTaskCheckbox:ElementRef;
  projectSearch :string;
  public projects:Project[];  
  public project:Project;
  public users:User[];
  public parentTaskDetails:TaskDetail[];
  public taskDetail:TaskDetail;
  results:string
  isParentTaskSelected:boolean = false;
  userSearch :string;
   managerName:string;
   ProjectName:string;
   parentTaskName:string;
   parentTaskSearch :string;
  constructor(private projectService:ProjectService,private userService:UserService,
    private taskManagerService:TaskService,private router: Router) { }

  ngOnInit() {
    this.taskDetail = new TaskDetail();
    this.taskDetail.Priority = 0;
    var EndDate = new Date();
    EndDate.setDate(new Date().getDate() + 1);  
    this.taskDetail.StartDate =  new Date();
    this.taskDetail.EndDate = EndDate;
    this.taskDetail.EndTask = true;
  }

  onSearchProject()
  {
    this.onGetAllProjects();
  }

  onGetAllProjects()
  {
    this.projectService.GetAllProjects().subscribe(
      p=>this.projects=p);
  }

  onParentTaskSelected(e)
  {
   this.isParentTaskSelected = e.target.checked;   
   if(e.target.checked)
   { 
    this.taskDetail.StartDate = null;
    this.taskDetail.EndDate = null;   
    this.taskDetail.Priority = 0;
    this.parentTaskName  ="";
    this.taskDetail.ParentId = undefined;
   }
   else
   {
    var EndDate = new Date();
    EndDate.setDate(new Date().getDate() + 1);  
    this.taskDetail.StartDate =  new Date();
    this.taskDetail.EndDate = EndDate;
   }
  }

  onAddTask()
  {
    var taskStartDate = new Date(this.taskDetail.StartDate); 
      var taskEndDate = new Date(this.taskDetail.EndDate);  
   
      if(!this.isParentTaskSelected && (taskEndDate <= taskStartDate ))
       {
         window.alert("End Date should not be prior/equal to start date");
         return false;
       }
    console.log('name:' + this.taskDetail.Name);
    console.log('Priority:' + this.taskDetail.Priority);      
    console.log('StartDate:' + this.taskDetail.StartDate);
    console.log('EndDate:' + this.taskDetail.EndDate);
    this.taskManagerService.AddTask(this.taskDetail).subscribe(response => 
      {
        this.results = "Task is added successfully and the id is  " + response;
        console.log("result text:" + this.results);
        this.openModal();
      },
      error =>
      {
        console.log(error.status);
        console.log(error.statusText);
        console.log(error._body);
        console.log(JSON.parse(error._body));
        if(error.status < 200 || error.status > 300)
          this.results = JSON.parse(error._body);
          this.openModal();
      }
    );
  }

  openModal() {
    this.showmodalClick.nativeElement.click();
  }

  onResetTask()
  {
    this.taskDetail = new TaskDetail();
    this.taskDetail.Priority = 0;
    this.parentTaskName  ="";
    this.managerName = "";
    this.ProjectName = ""
    var EndDate = new Date();
    EndDate.setDate(new Date().getDate() + 1);  
    this.taskDetail.StartDate =  new Date();
    this.taskDetail.EndDate = EndDate;
    this.showParentTaskCheckbox.nativeElement.checked = false;
  }

  onValidate()
  {
    if(this.taskDetail.Name == undefined || this.taskDetail.Name.trim().length == 0)
    return true;
    else if(this.taskDetail.UserDetail == null)
    return true;
    else if(this.taskDetail.ProjectDetail == null)
    return true;
    else if(!this.isParentTaskSelected && (this.taskDetail.StartDate.toString().trim().length == 0 || 
    this.taskDetail.EndDate.toString().trim().length == 0 ||
     this.taskDetail.Priority == 0 || this.taskDetail.ParentId == undefined))
    return true;
    else
    return false;
  }

  onSelectProject(selectedProject:Project)
    {
      this.taskDetail.ProjectDetail = selectedProject;
      this.taskDetail.ProjectId = selectedProject.ProjectId;
      this.ProjectName = selectedProject.ProjectName ;
    }

    onSearchManager()
    {
      this.onGetAllUsers();
    }

    onSelectManager(selectedUser:User)
    {
      this.taskDetail.UserDetail = selectedUser;
      this.taskDetail.UserId = selectedUser.UserId;
      this.managerName = selectedUser.FirstName + " " + selectedUser.LastName;
    }

    onSearchParent()
    {
      this.onGetAllParentTask();
    }

    onSelectParentTask(selectedTask:TaskDetail)
    {
      this.taskDetail.ParentId = selectedTask.Id;
    
      this.parentTaskName = selectedTask.Name;
    }

    closeModal() {
      
      return false;
    }

    onAddTaskNavigateToView()
    {
      this.router.navigate(['/viewTask']);
    }

    onGetAllUsers()
    {
      this.userService.GetAllUsers().subscribe(
        u=>this.users=u);
    }

    onGetAllParentTask()
    {
      this.taskManagerService.GetParentList().subscribe(
        response=>this.parentTaskDetails=response.filter(resElement => resElement.EndTask));
    }
   
}
