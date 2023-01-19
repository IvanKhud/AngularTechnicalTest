import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { of } from "rxjs";
import { Task } from "src/app/models/task.model";
import { TasksService } from "src/app/services/tasks.service";
import { EditTaskDialogComponent } from "../edit-task-dialog/edit-task-dialog.component";
import { TaskListComponent } from "./task-list.component";

describe(TaskListComponent.name, () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;
  let matDialogMock: MatDialog;
  let tasksServiceMock: TasksService;

  const taskMock: Task = {id: 1} as Task;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      providers: [
        {
          provide: TasksService,
          useValue: {
            tasks$: of([taskMock]),
            loadTasks: () => {},
            updateTask: () => {},
            deleteTask: () => {}
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => {}
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    tasksServiceMock = TestBed.inject(TasksService);
    matDialogMock = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should init dataSource and load tasks on init', () => {
    spyOn(tasksServiceMock, 'loadTasks');
    component.ngOnInit();

    expect(component.dataSource).toEqual(jasmine.any(MatTableDataSource));
    expect(tasksServiceMock.loadTasks).toHaveBeenCalledOnceWith();
  });

  it('should unsubscribe on destroy', () => {
    expect(component['subscription'].closed).toBe(false);

    component.ngOnDestroy();

    expect(component['subscription'].closed).toBe(true);
  });

  it('should open dialog on add task', () => {
    spyOn(matDialogMock, 'open');
    component.addTask();

    expect(matDialogMock.open).toHaveBeenCalledOnceWith(EditTaskDialogComponent, {
      data: {
        id: null,
        label: '',
        description: '',
        category: '',
        done: false
      }
    });
  });

  it('should open dialog on edit task', () => {
    spyOn(matDialogMock, 'open');
    component.editTask(taskMock);

    expect(matDialogMock.open).toHaveBeenCalledOnceWith(EditTaskDialogComponent, {data: { ...taskMock }});
  });

  it('should update and load tasks on mark as done', () => {
    spyOn(tasksServiceMock, 'updateTask').and.returnValue(of(null));
    spyOn(tasksServiceMock, 'loadTasks');
    component.markAsDone(taskMock);

    expect(tasksServiceMock.updateTask).toHaveBeenCalledOnceWith(taskMock.id, { done: jasmine.any(String) });
    expect(tasksServiceMock.loadTasks).toHaveBeenCalledOnceWith();
  });

  it('should delete and load tasks on delete', () => {
    const idMock: number = 1;
    spyOn(tasksServiceMock, 'deleteTask').and.returnValue(of(null));
    spyOn(tasksServiceMock, 'loadTasks');
    component.deleteTask(idMock);

    expect(tasksServiceMock.deleteTask).toHaveBeenCalledOnceWith(idMock);
    expect(tasksServiceMock.loadTasks).toHaveBeenCalledOnceWith();
  });
});
