import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { VoeMetaData } from '../models/verona-editor';

@Injectable({ providedIn: 'root' })
export class EditorMetadataService {
  editorMetadata!: VoeMetaData;

  constructor(@Inject(DOCUMENT) private document: Document) {
    const metadataEl = document.getElementById('verona-metadata');
    const metadataContent = metadataEl?.textContent;
    if (metadataContent) {
      this.editorMetadata = JSON.parse(metadataContent);
    }
  }
}
