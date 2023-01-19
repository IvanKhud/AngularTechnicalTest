import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TasksService } from "./tasks.service";
import {from, Subscription } from "rxjs";
import { Task } from "../models/task.model";

describe(TasksService.name, () => {
  let service: TasksService;
  let httpMock: HttpTestingController;
  let subscription: Subscription;

  const baseUrl: string = 'http://localhost:3000/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TasksService,

      ],
      imports: [HttpClientTestingModule]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);
    subscription = new Subscription();
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  it('should load tasks', () => {
    const tasksMock: Task[] = [{id: 1}] as Task[];
    let tasks: Task[];
    subscription.add(
      service.tasks$.subscribe((currentTasks: Task[]) => tasks = currentTasks)
    );
    service.loadTasks();
    const testRequest: TestRequest = httpMock.expectOne(baseUrl);
    testRequest.flush(tasksMock);

    expect(tasks).toEqual(tasksMock);
    expect(testRequest.request.method).toBe('GET');
    httpMock.verify();
  });

  it('should create task', () => {
    service.tasks$ = from([[{id: 1}, {id: 2}] as Task[]]);
    const taskMock: Partial<Task> = {
      description: 'fake_description'
    };
    subscription.add(
      service.createTask(taskMock).subscribe()
    );
    const testRequest: TestRequest = httpMock.expectOne(baseUrl);
    testRequest.flush({});

    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual({...taskMock, id: 3});
    httpMock.verify();
  });

  it('should update task', () => {
    const idMock: number = 1;
    const taskMock: Partial<Task> = {
      description: 'fake_description'
    };
    subscription.add(
      service.updateTask(idMock, taskMock).subscribe()
    );
    const testRequest: TestRequest = httpMock.expectOne(`${baseUrl}/${idMock}`);
    testRequest.flush({});

    expect(testRequest.request.method).toBe('PATCH');
    expect(testRequest.request.body).toEqual(taskMock);
    httpMock.verify();
  });

  it('should delete task', () => {
    const idMock: number = 1;
    subscription.add(
      service.deleteTask(idMock).subscribe()
    );
    const testRequest: TestRequest = httpMock.expectOne(`${baseUrl}/${idMock}`);
    testRequest.flush({});

    expect(testRequest.request.method).toBe('DELETE');
    httpMock.verify();
  });
});
