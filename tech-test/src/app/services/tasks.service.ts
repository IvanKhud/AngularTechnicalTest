import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class TasksService {
	private readonly baseUrl: string = 'http://localhost:3000/tasks';

	private tasksSource: BehaviorSubject<Task[]> = new BehaviorSubject([]);

	public tasks$: Observable<Task[]> = this.tasksSource.asObservable();

	constructor(private readonly http: HttpClient) {}

	public loadTasks(): void {
		this.http
			.get<Task[]>(this.baseUrl)
			.pipe(take(1))
			.subscribe((tasks: Task[]) => {
				this.tasksSource.next(tasks);
			});
	}

	public createTask(newTask: Partial<Task>): void {
		this.tasks$
			.pipe(
				take(1),
				map((tasks: Task[]) => {
					const ids: number[] = tasks.map((currentTask: Task) => currentTask.id);
					const newId: number = Math.max(...ids) + 1;
					return {
						...newTask,
						id: newId
					};
				}),
				switchMap((task: Task) => this.http.post<void>(this.baseUrl, task))
			)
			.subscribe(() => {
				this.loadTasks();
			});
	}

	public updateTask(id: number, task: Partial<Task>): void {
		this.http
			.patch<void>(`${this.baseUrl}/${id}`, task)
			.pipe(take(1))
			.subscribe(() => {
				this.loadTasks();
			});
	}

	public deleteTask(id: number): void {
		this.http
			.delete<void>(`${this.baseUrl}/${id}`)
			.pipe(take(1))
			.subscribe(() => {
				this.loadTasks();
			});
	}
}
