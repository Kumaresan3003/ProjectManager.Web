import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend, BaseRequestOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection} from  '@angular/http/testing';
import { Project } from '../models/project';

describe('ProjectService', () => {
  let mockBackend: MockBackend;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpModule],
      providers: [ProjectService,
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        deps: [MockBackend, BaseRequestOptions],
        useFactory:
          (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
          }
       }
      ]
    });

    mockBackend = getTestBed().get(MockBackend);
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));

  it('should get Projects', done => {
    let projectService: ProjectService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: [
                  {ProjectId: 1, ProjectName: 'Project 1', Priority:10},
                  {ProjectId: 2, ProjectName: 'Project 2',  Priority:20},
                ]
              }
            )));
        });

        projectService = getTestBed().get(ProjectService);
        expect(projectService).toBeDefined();

        projectService.GetAllProjects().subscribe((projects: Project[]) => {
            expect(projects.length).toBeDefined();
            expect(projects.length).toEqual(2);
            expect(projects[0].ProjectId).toEqual(1);
            expect(projects[0].ProjectName).toEqual('Project 1');
            expect(projects[1].ProjectName).toEqual('Project 2');
            done();
        });
    });
  });

  it('should get project for the given ProjectId', done => {
    let projectService: ProjectService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                      body:                
                        {ProjectId: 2, ProjectName: 'Project 2', Priority:20}                
                  }
            )));
        });

        projectService = getTestBed().get(ProjectService);
        expect(projectService).toBeDefined();
        projectService.GetProject(2).subscribe((project: Project) => {          
            expect(project.ProjectId).toEqual(2);
            expect(project.ProjectName).toEqual('Project 2');           
            done();
        });
    });
  });


  it('should insert new project',
    async(inject([ProjectService], (projectService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Post);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200, 
          body:{ProjectId: 2, ProjectName: 'Project 2', Priority:20}})));
      });

      let project = new Project ();
      project.Priority = 20;
      project.ProjectName="project 2";
      projectService.AddProject(project).subscribe(
        (projectResponse: Project) => {
          expect(projectResponse).toBeDefined();
          console.log(projectResponse);           
        expect(projectResponse.ProjectId).toBe(2);
        expect(projectResponse.ProjectName).toBe('Project 2');
        });
    })));

    it('should update existing project',
    async(inject([ProjectService], (projectService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Put);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200, 
          body:{ProjectId: 2, ProjectName: 'Project 2 updated', Priority:20}})));
      });

      let project = new Project ();
      project.ProjectId = 2;
      project.Priority = 10;
      project.ProjectName="Project 2 updated";
      projectService.EditProject(2, project).subscribe(
        (projectResponse: Project) => {
          expect(projectResponse).toBeDefined();
          console.log(projectResponse);
        expect(projectResponse.ProjectName).toBe("Project 2 updated");
        });
    })));

    it('should delete existing project',
    async(inject([ProjectService], (projectService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Delete);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200})));
      });
      
      projectService.DeleteProject(2).subscribe(
        (successResult) => {
          expect(successResult).toBeDefined();         
        //expect(successResult.status).toBe(200);
        },
        (errorResult) => {
          throw (errorResult);
        });
    })));
});
