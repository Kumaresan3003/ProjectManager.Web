import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Project } from '../../models/project';
import { TaskDetail } from '../../models/task-detail';
import { User } from '../../models/user';
import { ProjectService } from '../../SharedService/project.service';
import { TaskService } from '../../SharedService/task.service';
import { UserService } from '../../SharedService/user.service';
import 'rxjs/add/operator/catch';
import { Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-taskmgr-edit',
  templateUrl: './taskmgr-edit.component.html',
  styleUrls: ['./taskmgr-edit.component.css']
})
export class TaskmgrEditComponent implements OnInit {

  
  @ViewChild('showmodalClick') showmodalClick:ElementRef;
  @ViewChild('showParentTaskCheckbox') showParentTaskCheckbox:ElementRef;
  taskDetails:TaskDetail[]
  taskDetail:TaskDetail;
  parentTaskDetail:TaskDetail;
  updateTaskId:number
  results:string
  parentTaskName:string;
  showError:boolean = false;
  managerName:string;
   ProjectName:string;
   isParentTaskSelected:boolean = false;
   parentTaskSearch :string;
   userSearch :string;
   public parentTaskDetails:TaskDetail[];
   public users:User[];
  constructor(private projectService:ProjectService,private userService:UserService,
    private taskManagerService:TaskService,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.updateTaskId = params['id'];
    })
       
         this.taskManagerService.GetTask(this.updateTaskId).subscribe(
           response => { 
             this.taskDetail =  response;
             this.taskManagerService.GetTask(this.taskDetail.ParentId).subscribe(
              parentTaskResponse=>
              {
                this.parentTaskDetail=parentTaskResponse;                
                this.parentTaskName = this.parentTaskDetail.Name;
              });

              this.taskDetail.ParentId = this.taskDetail.ParentId;             
              this.ProjectName = this.taskDetail.ProjectDetail.ProjectName ;
              this.managerName = this.taskDetail.UserDetail.FirstName + " " +  this.taskDetail.UserDetail.LastName;
              if(this.taskDetail.StartDate == undefined)
              {
                this.showParentTaskCheckbox.nativeElement.checked = true;
                this.isParentTaskSelected = true;
              }
           },
           error =>
             {
               if(error.status < 200 || error.status > 300)
               {    
                 this.showError = true;     
                 this.results = JSON.parse(error._body);          
               }
                 console.log("error " + error.statusText);
             });
      
         
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

  onUpdateTask()
  {
    var taskStartDate = new Date(this.taskDetail.StartDate); 
    var taskEndDate = new Date(this.taskDetail.EndDate);  
 
    if(!this.isParentTaskSelected && (taskEndDate <= taskStartDate ))
     {
       window.alert("End Date should not be prior/equal to start date");
       return false;
     }
     
      this.taskManagerService.PutTask(this.taskDetail, this.taskDetail.Id).subscribe(response => 
        {
          this.results = this.results = "Task has been updated successfully for the name " + response;;
          console.log("result text:" + this.results);
          this.openModal();
        },
        error =>
        {
          if(error.status < 200 || error.status > 300)
          this.results = JSON.parse(error._body);
          this.openModal();
          console.log("error " + error._body);
        }
      );
  }

  onCancel()
  {
    this.router.navigate(['/viewTask']);
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

    onGetAllUsers()
    {
      this.userService.GetAllUsers().subscribe(
        u=>this.users=u);
    }

  onSearchParent()
  {
    this.onGetAllParentTask();
  }

  onGetAllParentTask()
  {
    this.taskManagerService.GetParentList().subscribe(
      response =>this.parentTaskDetails=response.filter(resElement => resElement.Id !=  this.updateTaskId && resElement.EndTask));
  }

  onSelectParentTask(selectedTask:TaskDetail)
    {
      this.taskDetail.ParentId = selectedTask.Id;    
      this.parentTaskName = selectedTask.Name;
    }
 

  openModal() {
    this.showmodalClick.nativeElement.click();
  }
  closeModal() {
    this.router.navigate(['/viewTask']);
  }

  closeModalPopup() {
      
    return false;
  }


}
