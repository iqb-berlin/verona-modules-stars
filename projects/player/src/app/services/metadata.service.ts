import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { VopMetaData } from '../../../../shared/models/verona';

@Injectable({
  providedIn: 'root'
})

export class MetadataService {
  playerMetadata!: VopMetaData;
  resourceURL: string | undefined;
  private document = inject(DOCUMENT);

  constructor() {
    const playerMetadata: string | null | undefined = this.document.getElementById('meta_data')?.textContent;
    if (playerMetadata) {
      this.playerMetadata = JSON.parse(playerMetadata);
    }
  }

  getResourceURL(): string {
    return this.resourceURL || 'assets';
  }
}
