import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskListComponent } from './components/task-list/task-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { EditTaskDialogComponent } from './components/edit-task-dialog/edit-task-dialog.component';

@NgModule({
	declarations: [AppComponent, TaskListComponent, EditTaskDialogComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatInputModule,
		MatCheckboxModule,
		MatButtonModule,
		MatFormFieldModule,
		FormsModule,
		MatDialogModule
	],
	providers: [HttpClient],
	bootstrap: [AppComponent]
})
export class AppModule {}
