import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../models/project';


@Pipe({
  name: 'ProjectNameSearch'
})
export class ProjectNameSearchPipe implements PipeTransform {

  transform(items: Project[], projectSearch: any): any {
    if (items && items.length){
      return items.filter(item =>{ 
        if (projectSearch)
        {
          if(item.ProjectName.toLowerCase().indexOf(projectSearch.toLowerCase()) === 0 || 
          item.Priority.toString().toLowerCase().indexOf(projectSearch.toLowerCase()) === 0 
        )        
          return true;
          else
          return false;
        }        
       return true;
    })
  }
    else{
        return items;
    }
  }
}
