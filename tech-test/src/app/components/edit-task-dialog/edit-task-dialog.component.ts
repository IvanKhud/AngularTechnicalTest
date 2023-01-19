import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';

@Component({
	selector: 'app-edit-task-dialog',
	templateUrl: 'edit-task-dialog.component.html',
	styleUrls: ['edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: Task,
		private readonly dialogRef: MatDialogRef<EditTaskDialogComponent>,
		private readonly tasksService: TasksService
	) {}

	public valueChange(event: Event, key: string): void {
		this.data[key] = (event.target as HTMLInputElement).value;
	}

	public cancel(): void {
		this.dialogRef.close();
	}

	public save(): void {
		if (this.data.id) {
			this.tasksService.updateTask(this.data.id, this.data);
		} else {
			this.tasksService.createTask(this.data);
		}

		this.dialogRef.close();
	}
}
