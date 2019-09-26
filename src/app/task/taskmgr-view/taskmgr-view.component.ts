import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TaskDetail } from '../../models/task-detail';
import { Project } from '../../models/project';
import { TaskService } from '../../SharedService/task.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProjectService } from '../../SharedService/project.service';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-taskmgr-view',
  templateUrl: './taskmgr-view.component.html',
  styleUrls: ['./taskmgr-view.component.css']
})
export class TaskmgrViewComponent implements OnInit {

  @ViewChild('showmodalClick') showmodalClick:ElementRef;
   taskDetails:TaskDetail[] = [];
   public taskDetailsFiltered:TaskDetail[] = [];
   projectSearch :string;
   public projects:Project[];  
   public project:Project;
   nameSearch :string;
   parentTaskSearch:string;
   PriorityFromSearch:number ;
   PriorityToSearch:number;
   StartDateSearch:string;
   EndDateSearch:string;
  taskDetail:TaskDetail;
  results:string;
  showError:boolean;
  ProjectName:string;
  path: string[] = ['StartDate'];
  order: number = 1; // 1 asc, -1 desc;

  constructor(private service:TaskService,private projectService:ProjectService,
    private router: Router, private location:Location) { }

  ngOnInit() {

       
  }

  onSearchProject()
  {
    this.onGetAllProjects();
  }

  onGetAllProjects()
  {
    this.projectService.GetAllProjects().subscribe(
      p=>this.projects=p.filter(pelement => pelement.EndProject));
  }

  onSelectProject(selectedProject:Project)
  {
    this.project = selectedProject;   
    this.ProjectName = selectedProject.ProjectName;
    this.service.GetAllTasks().subscribe(response =>
      {        
        (response as TaskDetail[]).filter(resElement => resElement.ProjectDetail.ProjectId ==  this.project.ProjectId).
        forEach(element =>
           {
             let taskDetail = (response as TaskDetail[]).find(res=> res.Id == element.ParentId);
             if(taskDetail != undefined)
                element.ParentName = taskDetail.Name;
             else       
                element.ParentName = "This Task has No Parent";
               
        }); 
        
        this.taskDetailsFiltered = response.filter(resElement => resElement.ProjectDetail.ProjectId ==  this.project.ProjectId);
        this.showError = false;
    },
    error =>
      {
        if(error.status < 200 || error.status > 300)
        {    
          this.showError = true;     
          this.results = JSON.parse(error._body);          
        }
          console.log("error " + error.statusText);
      }
    ); 
  }

  edit(taskId) {
    this.router.navigate(['/editTask'], { queryParams: { id: taskId} });
  }

  sortTask(prop: string) {
    this.path = prop.split('.')
    this.order = this.order * (-1); // change order
    return false; // do not reload
  }

  endTask(taskId) {
   
    this.taskDetail =  this.taskDetailsFiltered.find(taskElement => taskElement.Id == taskId);  
    this.taskDetail.EndTask = false;
    this.service.PutTask(this.taskDetail, this.taskDetail.Id).subscribe(response => 
      {
        if(response.length > 0)
          this.results = this.taskDetail.Name + " has been closed successfully";
        console.log("result text:" + this.results);
        this.openModal();
      },
      error =>
      {
        if(error.status < 200 || error.status > 300)
        {
          this.taskDetail.EndTask = true;
          this.results = error.statusText + "-" + JSON.parse(error._body);
          this.openModal();
        }
          console.log("error " + JSON.parse(error._body));
      }
    );
  }

  openModal() {
    this.showmodalClick.nativeElement.click();
  }

  closeModal() {
   // location.reload();
  }

}
