import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskListColumn } from '../../models/task-list-column';
import { TasksService } from '../../services/tasks.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-task-list',
	templateUrl: './task-list.component.html',
	styleUrls: ['./task-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit, OnDestroy {
	public dataSource: MatTableDataSource<Task>;

	public columns: TaskListColumn[] = [
		{
			key: 'label',
			type: 'text',
			header: 'Label'
		},
		{
			key: 'description',
			type: 'text',
			header: 'Description'
		},
		{
			key: 'category',
			type: 'text',
			header: 'Category'
		},
		{
			key: 'done',
			type: 'done',
			header: 'Done'
		},
		{
			key: 'id',
			type: 'controls',
			header: ''
		}
	];

	public displayedColumns = this.columns.map((column: TaskListColumn) => column.key);

  private subscription: Subscription = new Subscription();

	constructor(
		private readonly tasksService: TasksService,
		private readonly cdRef: ChangeDetectorRef,
		private readonly dialog: MatDialog
	) {}

	public ngOnInit(): void {
    this.subscription.add(
      this.tasksService.tasks$.subscribe((tasks: Task[]) => {
        this.dataSource = new MatTableDataSource(tasks);
        this.cdRef.detectChanges();
      })
    );
		this.tasksService.loadTasks();
	}

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

	public addTask(): void {
		this.dialog.open(EditTaskDialogComponent, {
			data: {
				id: null,
				label: '',
				description: '',
				category: '',
				done: false
			}
		});
	}

	public editTask(task: Task): void {
		this.dialog.open(EditTaskDialogComponent, {
			data: { ...task }
		});
	}

	public markAsDone(task: Task): void {
    this.subscription.add(
      this.tasksService.updateTask(task.id, {
        done: new Date().toDateString()
      }).subscribe(() => {
        this.tasksService.loadTasks();
      })
    );
	}

	public deleteTask(id: number): void {
    this.subscription.add(
      this.tasksService.deleteTask(id).subscribe(() => {
        this.tasksService.loadTasks();
      })
    );
	}

	public applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
}
