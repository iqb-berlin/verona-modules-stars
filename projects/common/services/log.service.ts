import { Injectable } from '@angular/core';

export enum LogLevel { NONE = 0, ERROR = 1, WARN = 2, INFO = 3, DEBUG = 4 }

@Injectable({
  providedIn: 'root'
})
export class LogService {
  static level: LogLevel = 4;

  static error(...args: unknown[]): void {
    if (LogService.level >= LogLevel.ERROR) {
      window.console.error.apply(console, args);
    }
  }

  static warn(...args: unknown[]): void {
    if (LogService.level >= LogLevel.WARN) {
      window.console.warn.apply(console, args);
    }
  }

  static info(...args: unknown[]): void {
    if (LogService.level >= LogLevel.INFO) {
      window.console.info.apply(console, args);
    }
  }

  static debug(...args: unknown[]): void {
    if (LogService.level >= LogLevel.DEBUG) {
      window.console.log.apply(console, args);
    }
  }
}
