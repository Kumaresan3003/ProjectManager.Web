import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend, BaseRequestOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection} from  '@angular/http/testing';
import { User } from '../models/user';

describe('UserService', () => {
  let mockBackend: MockBackend;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpModule],
      providers: [UserService,
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

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should get Users', done => {
    let userService: UserService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: [
                  {UserId: 1, FirstName: 'User 1', LastName:'LastName', EmployeeId:10},
                  {UserId: 2, FirstName: 'User 2', LastName:'last user', EmployeeId:20},
                ]
              }
            )));
        });

        userService = getTestBed().get(UserService);
        expect(userService).toBeDefined();

        userService.GetAllUsers().subscribe((users: User[]) => {
            expect(users.length).toBeDefined();
            expect(users.length).toEqual(2);
            expect(users[0].UserId).toEqual(1);
            expect(users[0].EmployeeId).toEqual(10);
            expect(users[1].EmployeeId).toEqual(20);
            done();
        });
    });
  });

  it('should get user for the given UserId', done => {
    let userService: UserService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                      body:                
                        {UserId: 2, FirstName: 'User 2', LastName:'last user', EmployeeId:20}                
                  }
            )));
        });

        userService = getTestBed().get(UserService);
        expect(userService).toBeDefined();
        userService.GetUser(2).subscribe((user: User) => {          
            expect(user.UserId).toEqual(2);
            expect(user.EmployeeId).toEqual(20);           
            done();
        });
    });
  });


  it('should insert new user',
    async(inject([UserService], (userService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Post);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200, body:{UserId: 2, FirstName: 'User 2', LastName:'last user', EmployeeId:20}})));
      });

      let user = new User ();
      user.EmployeeId = 20;
      user.FirstName="user 2";
      userService.AddUser(user).subscribe(
        (userResponse: User) => {
          expect(userResponse).toBeDefined();
          console.log(userResponse);  
          //let userResponse = <User>JSON.parse(successResult);  
        expect(userResponse.UserId).toBe(2);
        });
    })));

    it('should update existing user',
    async(inject([UserService], (userService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Put);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200, body:{UserId: 2, FirstName: 'User 2 updated', LastName:'last user', EmployeeId:20}})));
      });

      let user = new User ();
      user.UserId = 2;
      user.EmployeeId = 10;
      user.FirstName="User 2 updated";
      userService.EditUser(2, user).subscribe(
        (userResponse: User) => {
          expect(userResponse).toBeDefined();
          console.log(userResponse);
        expect(userResponse.FirstName).toBe("User 2 updated");
        });
    })));

    it('should delete existing user',
    async(inject([UserService], (userService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Delete);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200})));
      });
      
      userService.DeleteUser(2).subscribe(
        (successResult) => {
          expect(successResult).toBeDefined();         
        //expect(successResult.status).toBe(200);
        },
        (errorResult) => {
          throw (errorResult);
        });
    })));
});
