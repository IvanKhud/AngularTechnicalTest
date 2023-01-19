import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnDestroy } from '@angular/core';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { Observable, Subscription } from 'rxjs';

@Component({
	selector: 'app-edit-task-dialog',
	templateUrl: 'edit-task-dialog.component.html',
	styleUrls: ['edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent implements OnDestroy {
  private subscription: Subscription = new Subscription();
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: Task,
		private readonly dialogRef: MatDialogRef<EditTaskDialogComponent>,
		private readonly tasksService: TasksService
	) {}

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

	public valueChange(event: Event, key: string): void {
		this.data[key] = (event.target as HTMLInputElement).value;
	}

	public cancel(): void {
		this.dialogRef.close();
	}

	public save(): void {
    const saveAction: Observable<void> = this.data.id ? this.tasksService.updateTask(this.data.id, this.data) : this.tasksService.createTask(this.data);
		this.subscription.add(
      saveAction.subscribe(() => {
        this.tasksService.loadTasks();
      })
    );
		this.dialogRef.close();
	}
}
