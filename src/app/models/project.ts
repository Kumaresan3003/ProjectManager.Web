import { User } from './user';
import { TaskDetail } from './task-detail';

export class Project {
    ProjectId:number;
    ProjectName : string;
    StartDate: Date;
    EndDate:Date;
    Priority: number;
    UserId:number;
    EndProject:boolean;
    UserDetail:User;
    TaskDetails:TaskDetail[];
}
