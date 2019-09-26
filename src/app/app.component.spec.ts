import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router,ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')  
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule],
      declarations: [
        AppComponent
      ],
     
      providers: [       
       { provide: Router, useValue: mockRouter}
     ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Project Manager'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Project Manager');
  }));

 
  it('onNaviagteToTaskView click should go to view task screen', () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onNaviagteToTaskView();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/viewTask']);
  })

  it('onNaviagteToTaskAdd click should go to Add task screen', () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onNaviagteToTaskAdd();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/addTask']);
  })

  it('onNaviagteToUserAdd click should go to Add User screen', () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onNaviagteToUserAdd();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/addUser']);
  })

  it('onNaviagteToProjectAdd click should go to Add Project screen', () =>
  {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onNaviagteToProjectAdd();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/addProject']);
  })



});
