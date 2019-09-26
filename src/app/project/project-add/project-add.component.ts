import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Project } from '../../models/project';
import { ProjectView } from '../../models/project-view';
import { ProjectService } from '../../SharedService/project.service';
import { UserService } from '../../SharedService/user.service';
import 'rxjs/add/operator/catch';
import { DatePipe } from '@angular/common';
import { User } from '../../models/user';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit {
  @ViewChild('showDateCheckbox') showDateCheckbox:ElementRef;
  public project:Project;
  public projectsToView:ProjectView[] = [];
  enableDate:boolean = false;
  userSearch :string;
  StartDate:string;
  managerName:string;
  public updatedProjects:Project[];  
  public users:User[];
  public success:boolean = false;
  public failure:boolean = false;
  showAdd:boolean = true;
  showUpdate:boolean = false;
  results:string
  constructor(private service:ProjectService,private userService:UserService) {
    this.project = new Project();
    this.project.Priority = 0;  
    this.project.EndProject = true;  
   }

  ngOnInit() {
    this.onGetAllProject();   
  }

  onDateSelected(e)
  {
    this.enableDate = e.target.checked;
    if(e.target.checked)
    {    
     var EndDate = new Date();
     EndDate.setDate(new Date().getDate() + 1);  
     this.project.StartDate =  new Date();
     this.project.EndDate = EndDate;
    }
    else
    {
      console.log(this.project.StartDate);
      console.log(this.project.EndDate);
      this.project.StartDate = null;
      this.project.EndDate = null;
    }

    console.log(e.target.checked);
  }

  onValidate()
  {
    if(this.project.ProjectName == undefined || this.project.ProjectName.trim().length == 0)
    return true;
    else if(this.project.UserDetail == null)
    return true;
    else if(this.enableDate && (this.project.StartDate.toString().trim().length == 0 || 
    this.project.EndDate.toString().trim().length == 0))
    return true;
    else
    return false;
  }

  onAddProject()
  {  
   var projectStartDate = new Date(this.project.StartDate); 
   var projectEndDate = new Date(this.project.EndDate);  

   if(this.enableDate && (projectEndDate <= projectStartDate ))
    {     
      window.alert("End Date should not be prior/equal to start date");
      return false;
    }
   
    this.service.AddProject(this.project).subscribe(response => 
      {
        this.results = "Project is added successfully and the id is " + response;
        console.log("result text:" + this.results);  
        this.onResetProject();  
        console.log("result text:" + this.results);  
        this.projectsToView.splice(0);
        this.onGetAllProject()
        this.success = true;        
      },
      error =>
      {         
        if(error.status < 200 || error.status > 300)
          this.results = JSON.parse(error._body);
          this.failure = true;          
      }
    );
    
  }

  onUpdateProject()
  {
    var projectStartDate = new Date(this.project.StartDate); 
   var projectEndDate = new Date(this.project.EndDate);  

   if(this.enableDate && (projectEndDate <= projectStartDate ))
    {
      window.alert("End Date should not be prior/equal to start date");
      return false;
    }

    this.service.EditProject(this.project, this.project.ProjectId).subscribe(response => 
      {
        this.results = "Project has been updated successfully for the project id " + response;
        console.log("result text:" + this.results);  
        this.project = new Project();    
        this.onResetProject();   
        this.projectsToView.splice(0);
        this.onGetAllProject()
        this.success = true;  
        this.showUpdate = false;
        this.showAdd = true;
      },
      error =>
      {         
        if(error.status < 200 || error.status > 300)
          this.results = JSON.parse(error._body);
          this.project = new Project();       
          this.failure = true;     
          this.showUpdate = false;
          this.showAdd = true;     
      }
    ); 
  }

    onResetProject()
    {
      this.project = new Project();  
      this.project.Priority = 0; 
      this.showUpdate = false;
      this.showAdd = true;  
      this.managerName = "";
      this.enableDate = false;
      this.showDateCheckbox.nativeElement.checked = false;     
    }  

    onSearchManager()
    {
      this.onGetAllUsers();
    }

    onSelectManager(selectedUser:User)
    {
      this.project.UserDetail = selectedUser;
      this.project.UserId = selectedUser.UserId;
      this.managerName = selectedUser.FirstName + " " + selectedUser.LastName;
    }

    closeModal() {
     return false;
    }

    onGetAllUsers()
    {
      this.userService.GetAllUsers().subscribe(
        u=>this.users=u);
    }

    onGetAllProject()
    {      
     this.service.GetAllProjects().subscribe(
       projectResponse =>
          {
            (projectResponse as Project[]).forEach(element => 
              {               
                var projectToView = new ProjectView();
                projectToView.Priority = element.Priority;
                projectToView.StartDate = element.StartDate;
                projectToView.EndDate = element.EndDate;
                projectToView.ProjectId = element.ProjectId;
                projectToView.ProjectName = element.ProjectName;
                projectToView.numberOfTasks = element.TaskDetails.length;
                projectToView.completedTasks = element.TaskDetails.filter(t=> !t.EndTask).length;
                this.projectsToView.push(projectToView);               
              }); 
          }
       );
    }

    projectSelectionChangedHandler(selectedProjectId:number)
    {
      this.service.GetProject(selectedProjectId).subscribe(
        projectResponse => 
        {
          this.project = projectResponse as Project;
         this.managerName =  this.project.UserDetail.FirstName + " " + this.project.UserDetail.LastName;
         if(this.project.StartDate.toString().length > 0 || this.project.EndDate.toString().length > 0)
         this.showDateCheckbox.nativeElement.checked = true;
         this.enableDate = true;
        });  
        
        this.showUpdate = true;
        this.showAdd = false;
        this.success = false; 
        this.failure = false;
    }

}
