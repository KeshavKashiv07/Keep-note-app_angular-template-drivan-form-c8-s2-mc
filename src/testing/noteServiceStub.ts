import { of } from "rxjs";
import { Note } from "../app/models/note";

export class NoteServiceStub {
    getAllNotes() {
        console.log("getNotes() from stub is called");
        return of([] as Note[]);
    }

    saveNote(note:any) {
        console.log("addNote() from stub is called");
        return of({} as Note);
    }
}
