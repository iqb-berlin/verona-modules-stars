import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PageChangeService {
  @Output() pageChanged = new EventEmitter<void>();
}
