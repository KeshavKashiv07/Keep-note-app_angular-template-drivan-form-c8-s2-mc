import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { NoteAddComponent } from 'src/app/note-add/note-add.component';
import { NoteServiceStub } from './noteServiceStub';
import { NoteService } from 'src/app/service/note.service';

describe('NotAddComponent', () => {
    let component: NoteAddComponent;
    let fixture: ComponentFixture<NoteAddComponent>;
    let noteService: NoteService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NoteAddComponent],
            imports: [
                FormsModule,
                MatFormFieldModule,
                MatSelectModule,
                BrowserAnimationsModule,
                MatInputModule,
                MatRadioModule,
                MatSnackBarModule,
                MatButtonModule,
                MatToolbarModule,
                MatDatepickerModule,
                MatNativeDateModule,
                MatIconModule,
                MatExpansionModule,
            ],
            providers: [{ provide: NoteService, useClass: NoteServiceStub }]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NoteAddComponent);
        noteService = TestBed.inject(NoteService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
    it('should create 4 form mat-form-field, 1 mat-radio-group and 1 submit button elements', () => {
        const formElement = fixture.debugElement.query(By.css('form'));
        expect(formElement.queryAll(By.css('mat-form-field')).length).toEqual(4);
        expect(formElement.queryAll(By.css('mat-form-field [matInput]')).length).toEqual(4);
        expect(formElement.queryAll(By.css('mat-radio-group')).length).toEqual(1);
        expect(formElement.queryAll(By.css('button[type="submit"]')).length).toEqual(1);
    })

    it('should display error messages when required form fields are empty', () => {
        const titleElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector("input[name='title']");
        const contentElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector("textarea[name='content']");
        const reminderDateElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector("input[name='reminderDate']");
        const submitButton: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("button[type='submit']");

        titleElement.dispatchEvent(new Event('blur'));
        contentElement.dispatchEvent(new Event('blur'));
        reminderDateElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        const errors = fixture.debugElement.queryAll(By.css("mat-error"));
        expect(errors.length).toEqual(3);
        expect(errors[0].nativeElement.innerHTML.trim().toLowerCase()).toEqual('note title is required');
        expect(errors[1].nativeElement.innerHTML.trim().toLowerCase()).toEqual('note content is required');
        expect(errors[2].nativeElement.innerHTML.trim().toLowerCase()).toEqual('reminder date is required');
        expect(submitButton.disabled).toBeTruthy();

    });

    it('Should display error message if the note content entered is less than 5 characters', () => {
        const contentElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector("textarea[name='content']");
        contentElement.value = 'note';
        contentElement.dispatchEvent(new Event('blur'));
        contentElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const errors = fixture.debugElement.queryAll(By.css("mat-error"));
        expect(errors.length).toEqual(1);
        expect(errors[0].nativeElement.innerHTML.trim().toLowerCase()).toContain('minimum 5 characters');
    });

    it('should enable submit button for valid values and call the function to add the new note', fakeAsync(() => {
        const titleElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector("input[name='title']");
        const contentElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector("textarea[name='content']");
        const reminderDateElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector("input[name='reminderDate']");
        const categoryElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector("input[name='category']");
        const submitButton: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("button[type='submit']");

        titleElement.value = 'Sample Note';
        contentElement.value = 'Sample note for testing';
        reminderDateElement.value = Date();
        categoryElement.value='office';
        titleElement.dispatchEvent(new Event('input'));
        contentElement.dispatchEvent(new Event('input'));
        reminderDateElement.dispatchEvent(new Event('input'));
        categoryElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
              
        expect(submitButton.disabled).toBeTruthy();
        let spy = spyOn(noteService, "saveNote").and.callThrough();
        let form = fixture.debugElement.query(By.css('form'));
          let note = component.note;
        form.triggerEventHandler("submit", {});
        expect(spy).toHaveBeenCalledTimes(1);
        flush();
    }))
});