import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { of } from "rxjs";
import { Task } from "src/app/models/task.model";
import { TasksService } from "src/app/services/tasks.service";
import { EditTaskDialogComponent } from "./edit-task-dialog.component";
import Spy = jasmine.Spy;

describe(EditTaskDialogComponent.name, () => {
  let fixture: ComponentFixture<EditTaskDialogComponent>;
  let component: EditTaskDialogComponent;
  let dialogCloseSpy: Spy;
  let matDialogRefMock: MatDialogRef<EditTaskDialogComponent>;
  let tasksServiceMock: TasksService;

  const dataMock: Task = { id: 1 } as Task;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTaskDialogComponent],
      providers: [
        {
          provide: TasksService,
          useValue: {
            updateTask: () => {},
            createTask: () => {},
            loadTasks: () => {}
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dataMock
        },
        {
          provide: MatDialogRef,
          useValue: { close: () => {} }
        }
      ],
      imports: [MatDialogModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture =  TestBed.createComponent(EditTaskDialogComponent);
    component = fixture.componentInstance;
    dialogCloseSpy = jasmine.createSpy();
    matDialogRefMock = TestBed.inject(MatDialogRef);
    tasksServiceMock = TestBed.inject(TasksService);
    fixture.detectChanges();
  });

  it('should unsubscribe on destroy', () => {
    expect(component['subscription'].closed).toBe(false);

    component.ngOnDestroy();

    expect(component['subscription'].closed).toBe(true);
  });

  it('should update data on value change', () => {
    const dataMock: Task = { id: 1 } as Task;
    const valueMock: string = 'fake_value';
    const keyMock: string = 'description';
    component.valueChange({ target: { value: valueMock } } as any, keyMock);

    expect(component.data.description).toBe(valueMock);
  });

  it('should close dialog on cancel', () => {
    spyOn(matDialogRefMock, 'close');

    component.cancel();

    expect(matDialogRefMock.close).toHaveBeenCalledOnceWith();
  });

  it('should create task on save when no id provided', () => {
    spyOn(tasksServiceMock, 'createTask').and.returnValue(of(null));
    spyOn(tasksServiceMock, 'loadTasks');
    component.data.id = null;
    component.save();

    expect(tasksServiceMock.createTask).toHaveBeenCalledOnceWith(dataMock);
    expect(tasksServiceMock.loadTasks).toHaveBeenCalledOnceWith();
  });

  it('should update task on save when id provided', () => {
    spyOn(tasksServiceMock, 'updateTask').and.returnValue(of(null));
    spyOn(tasksServiceMock, 'loadTasks');
    component.save();

    expect(tasksServiceMock.updateTask).toHaveBeenCalledOnceWith(dataMock.id, dataMock);
    expect(tasksServiceMock.loadTasks).toHaveBeenCalledOnceWith();
  });
});
