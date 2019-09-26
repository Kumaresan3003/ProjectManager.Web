import { User } from './user';
import { Project } from './project';

export class TaskDetail 
{
    Id:number;
    Name:string;
    StartDate:Date;
    EndDate:Date;
    Priority:number;
    ParentId:number;  
    ParentName:string; 
    EndTask:boolean;
    ProjectId:number;
    ProjectDetail : Project;
    UserId:number;   
    UserDetail:User;
}