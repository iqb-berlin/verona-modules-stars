

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VeronaResponse, ResponseStatus, Progress } from '../models/verona';

export interface ElementCode {
  id: string;
  alias: string;
  value: string | number | boolean | null;
  status: ResponseStatus;
  code?: number;
  score?: number;
  timeStamp: number;
  domElement?: HTMLElement;
  pageIndex?: number | null;
}

export interface ElementIdentifier {
  id: string;
  alias: string;
}

@Injectable({
  providedIn: 'root'
})
export class UnitStateService {
  private elementCodes: Map<string, ElementCode> = new Map();
  private _elementCodeChanged = new Subject<ElementCode>();
  private _pagePresented = new Subject<number>();
  private presentedPages: Set<number> = new Set();

  // Observable streams for external subscription
  get elementCodeChanged() {
    return this._elementCodeChanged.asObservable();
  }

  get pagePresented() {
    return this._pagePresented.asObservable();
  }

  // Register an element with initial state
  registerElementCode(
    id: string,
    alias: string,
    value: any,
    domElement?: HTMLElement,
    pageIndex?: number | null
  ): void {
    const existingCode = this.elementCodes.get(id);

    if (existingCode) {
      // Update existing with new DOM element but keep saved value and status
      existingCode.domElement = domElement;
      if (pageIndex !== undefined) existingCode.pageIndex = pageIndex;
      this._elementCodeChanged.next(existingCode);
      return;
    }

    const elementCode: ElementCode = {
      id,
      alias,
      value,
      status: ResponseStatus.UNSET,
      timeStamp: Date.now(),
      domElement,
      pageIndex
    };

    this.elementCodes.set(id, elementCode);
    this._elementCodeChanged.next(elementCode);
  }

  // Update element value and status
  changeElementCodeValue(change: {
    id: string;
    value: any;
    status?: ResponseStatus;
    code?: number;
    score?: number
  }): void {
    const elementCode = this.elementCodes.get(change.id);
    if (elementCode) {
      elementCode.value = change.value;
      elementCode.status = change.status || ResponseStatus.VALUE_CHANGED;
      elementCode.timeStamp = Date.now();

      if (change.code !== undefined) elementCode.code = change.code;
      if (change.score !== undefined) elementCode.score = change.score;

      this.elementCodes.set(change.id, elementCode);
      this._elementCodeChanged.next(elementCode);
    }
  }

  // Get element by ID
  getElementCodeById(id: string): ElementCode | undefined {
    return this.elementCodes.get(id);
  }

  // Get initial value for restoration
  getInitialValue(elementId: string): any {
    const elementCode = this.elementCodes.get(elementId);
    return elementCode ? elementCode.value : null;
  }

  // Register element and restore if saved state exists
  registerElementWithRestore(
    id: string,
    alias: string,
    defaultValue: any,
    domElement?: HTMLElement,
    pageIndex?: number | null
  ): any {
    const existingState = this.elementCodes.get(id);

    if (existingState) {
      // Update DOM element but restore existing value
      existingState.domElement = domElement;
      if (pageIndex !== undefined) existingState.pageIndex = pageIndex;
      return existingState.value;
    } else {
      // Create new state with default value
      this.registerElementCode(id, alias, defaultValue, domElement, pageIndex);
      return defaultValue;
    }
  }

  // Get all responses for state notification
  getResponses(): VeronaResponse[] {
    return Array.from(this.elementCodes.values()).map(elementCode => ({
      id: elementCode.id,
      alias: elementCode.alias,
      value: elementCode.value,
      status: elementCode.status,
      code: elementCode.code,
      score: elementCode.score,
      timeStamp: elementCode.timeStamp
    }));
  }

  // Mark page as presented
  markPagePresented(pageIndex: number): void {
    this.presentedPages.add(pageIndex);
    this._pagePresented.next(pageIndex);
  }

  // Get presentation progress
  get presentedPagesProgress(): Progress {
    if (this.presentedPages.size === 0) return 'none';
    // You can implement more sophisticated logic here based on total pages
    return this.presentedPages.size > 0 ? 'some' : 'none';
  }

  // Reset state (for new unit)
  reset(): void {
    this.elementCodes.clear();
    this.presentedPages.clear();
  }

  // Set element codes from unit state (for restoration)
  setElementCodes(elementCodes: any[], elementIdentifiers: ElementIdentifier[]): void {
    elementCodes.forEach(code => {
      this.elementCodes.set(code.id, {
        id: code.id,
        alias: code.alias || code.id,
        value: code.value,
        status: code.status || ResponseStatus.UNSET,
        code: code.code,
        score: code.score,
        timeStamp: code.timeStamp || Date.now()
      });
    });
  }
}
