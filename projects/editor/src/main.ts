import { bootstrapApplication } from '@angular/platform-browser';
import { EditorComponent } from './app/editor.component';

bootstrapApplication(EditorComponent)
  .catch(err => console.error(err));
