import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { EditorVeronaSubscriptionService } from './services/editor-verona-subscription.service';
import { EditorVeronaPostService } from './services/editor-verona-post.service';
import { EditorMetadataService } from './services/editor-metadata.service';
import { EditorStateService } from './services/editor-state.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AppComponent
  ],
  providers: [
    provideZonelessChangeDetection(),
    EditorVeronaSubscriptionService,
    EditorVeronaPostService,
    EditorMetadataService,
    EditorStateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
