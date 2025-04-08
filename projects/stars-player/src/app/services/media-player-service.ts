import { EventEmitter, Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class MediaPlayerService {
  public durationChange: EventEmitter<MediaChangeItem>;
  private currentDuration = 0;
  private currentPercentage: number = 0;

  constructor() {
    this.durationChange = new EventEmitter();
    // fromEvent(window, 'message')
    //   .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VopMessage));
  }

  public changeDuration(event: MediaChangeItem): void {
    this.currentDuration = event.currentDuration;
    this.currentPercentage = event.currentPercentage;
    this.durationChange.emit(event);
  }

  public getCurrentDuration() {
    return this.currentDuration;
  }
}

export class MediaChangeItem {
  currentDuration: number;
  currentPercentage: number;

  constructor(duration: number, percentage?: number) {
    this.currentDuration = duration;
    this.currentPercentage = percentage || undefined;
  }
}
