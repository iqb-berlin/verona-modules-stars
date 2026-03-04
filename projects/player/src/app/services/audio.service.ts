import { inject, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ResponsesService } from './responses.service';
import { AudioOptions } from '../models/unit-definition';

export enum AudioPlayerStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  ENDED = 'ENDED',
  READY = 'READY',
  EMPTY = 'EMPTY',
  NO_SOURCE = 'NO_SOURCE'
}

type MediaEventType =
  | 'playing'
  | 'pause'
  | 'ended'
  | 'canplay'
  | 'loadedmetadata'
  | 'canplaythrough';

export class AudioService {
  responsesService = inject(ResponsesService);
  private readonly _audioElement: HTMLAudioElement | null = null;

  /** Signals for audioId, maxPlay, playCount, and isPlaying derive from the audio source. */
  _audioId = signal('audio');
  audioId = this._audioId.asReadonly();
  _maxPlay = signal(0);
  maxPlay = this._maxPlay.asReadonly();
  _playCount = signal(0);
  playCount = this._playCount.asReadonly();
  _isPlaying = signal(false);
  isPlaying = this._isPlaying.asReadonly();

  /** The currently loaded audio source. */
  private _currentSource = signal<string | undefined>(undefined);
  currentSource = this._currentSource.asReadonly();

  private currentTime = 0;
  _percentElapsed = signal(0);
  percentElapsed = this._percentElapsed.asReadonly();

  /** Player status used to track the current state of the audio player. */
  private playerStatus = new BehaviorSubject<AudioPlayerStatus>(AudioPlayerStatus.EMPTY);

  constructor() {
    this._audioElement = new Audio();
    this.attachListeners();
  }

  attachListeners() {
    if (this._audioElement === null) return;
    this._audioElement.addEventListener('playing', () => this.setPlayerStatus('playing'));
    this._audioElement.addEventListener('pause', () => this.setPlayerStatus('pause'));
    this._audioElement.addEventListener('ended', () => this.setPlayerStatus('ended'));
    this._audioElement.addEventListener('canplay', () => this.setPlayerStatus('canplay'));
    this._audioElement.addEventListener('loadedmetadata', () => this.setPlayerStatus('loadedmetadata'));
    this._audioElement.addEventListener('canplaythrough', () => this.setPlayerStatus('canplaythrough'));
    this._audioElement.addEventListener('timeupdate', this.calculateTime, false);
  }

  private setPlayerStatus = (type: MediaEventType) => {
    switch (type) {
      case 'playing':
        this.playerStatus.next(AudioPlayerStatus.PLAYING);
        break;
      case 'pause':
        this._isPlaying.set(false);
        this.playerStatus.next(AudioPlayerStatus.PAUSED);
        this.sendPlaybackTimeChanged();
        break;
      case 'ended':
        this._isPlaying.set(false);
        this._playCount.set(this.playCount() + 1);
        this._percentElapsed.set(0);
        this.playerStatus.next(AudioPlayerStatus.ENDED);
        this.sendPlaybackTimeChanged();
        break;
      case 'canplay':
      case 'loadedmetadata':
      case 'canplaythrough':
        this.playerStatus.next(AudioPlayerStatus.READY);
        break;
      default:
        this.playerStatus.next(AudioPlayerStatus.EMPTY);
        break;
    }
  };

  private calculateTime = () => {
    if (this._audioElement) {
      this.currentTime = this._audioElement.currentTime;
      this.setPercentElapsed(this._audioElement.duration, this.currentTime);
      this.sendPlaybackTimeChanged();
    }
  };

  setPercentElapsed(d: number, ct: number) {
    if (d === 0) return;
    this._percentElapsed.set(ct / d);
  }

  getPlayerStatus(): Observable<AudioPlayerStatus> {
    return this.playerStatus.asObservable();
  }

  /** Current status value helper */
  getPlayerStatusValue(): AudioPlayerStatus {
    return this.playerStatus.value;
  }

  play() {
    this._audioElement?.play();
    this._isPlaying.set(true);
  }

  pause() {
    this._audioElement?.pause();
    this._isPlaying.set(false);
  }

  /**
   * Function to set the audio source and reset the playback position to the beginning.
   * Uses READY from AudioPlayerStatus to resolve when the audio is ready to play.
   * @param audio - audio source as base64 string
   * @returns Promise<boolean> - resolves to true when the audio is READY
   */
  setAudioSrc(audio: AudioOptions): Promise<boolean> {
    return new Promise(resolve => {
      // normalize and check for a valid source first
      const source = (audio?.audioSource || '').trim();
      const variableId = audio.audioId || 'audio';
      const formerResponse = this.responsesService.getResponseByVariableId(variableId);

      // update meta/signals
      this._audioId.set(variableId);
      this._maxPlay.set(audio.maxPlay || 0);
      this._playCount.set(formerResponse.value as number || 0);
      this._percentElapsed.set(0);
      this.currentTime = 0;

      // If no valid source: reset element, mark NO_SOURCE, and resolve(false)
      if (!source) {
        if (this._audioElement) {
          try {
            this._audioElement.pause();
          } catch { /* ignore */ }
          this._audioElement.src = '';
          this._audioElement.load();
        }
        this._isPlaying.set(false);
        this._currentSource.set(undefined);
        this.playerStatus.next(AudioPlayerStatus.NO_SOURCE);
        resolve(false);
        return;
      }

      // feed the element with the correct audio source
      if (this._audioElement) {
        this._audioElement.src = source;
        this._audioElement.load();
      }
      this._currentSource.set(source);

      // mark status as EMPTY until the element is ready, then wait for READY
      this.playerStatus.next(AudioPlayerStatus.EMPTY);
      const subscribedStatus = this.getPlayerStatus().subscribe(status => {
        if (status === AudioPlayerStatus.READY) {
          subscribedStatus.unsubscribe();
          resolve(true);
        }
      });
    });
  }

  /**
   * Function to play the current audio source. Checks for the audioId
   * @returns Promise<boolean> - resolves to true if the audio source was successfully played
   */
  getPlayFinished(id: string): Promise<boolean> {
    if (id !== this.audioId()) return Promise.resolve(false);
    if (this.maxPlay() !== 0 && this.playCount() >= this.maxPlay()) return Promise.resolve(false);
    // If the audio has reached the end previously, reset to the beginning before replaying
    try {
      if (this.getPlayerStatusValue() === AudioPlayerStatus.ENDED && this._audioElement) {
        this._audioElement.currentTime = 0;
      }
    } catch { /* ignore */ }
    this.play();
    return new Promise(resolve => {
      setTimeout(() => {
        const onEnded = () => {
          cleanup();
          resolve(true);
        };
        const onPause = () => {
          if (!this.isPlaying()) {
            cleanup();
            resolve(true);
          }
        };
        const cleanup = () => {
          this._audioElement?.removeEventListener('ended', onEnded);
          this._audioElement?.removeEventListener('pause', onPause);
        };
        this._audioElement?.addEventListener('ended', onEnded, { once: true });
        this._audioElement?.addEventListener('pause', onPause, { once: true });
      }, 50);
    });
  }

  /** send playback time as a percentage of audio duration as a response */
  sendPlaybackTimeChanged(): void {
    let audioValue = this.percentElapsed() || 0;
    audioValue += this.playCount();

    this.responsesService.newResponses([{
      id: this.audioId(),
      value: audioValue,
      status: 'VALUE_CHANGED'
    }]);
  }
}
