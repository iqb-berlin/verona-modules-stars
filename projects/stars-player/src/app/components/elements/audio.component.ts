import { Component, ElementRef, input, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { AudioElement } from "../../models";
import { MediaPlayerElementComponent } from "../../directives/media-player-element-component.directive";

@Component({
  selector: 'stars-audio',
  template: `
    @if (elementModel().audioSrc) {
      <div class="audio-instruction-container">
        <div class="audio-button-wrapper">
          <stars-media-player [player]="player"
                              [playerId]="elementModel().id"
                              [isPlaying]="isPlaying"
                              (elementValueChanged)="valueChanged($event)"
                              [image]="elementModel().image">
            <audio #player
                   [src]="elementModel().audioSrc | safeResourceUrl"
                   (loadedmetadata)="onAudioLoaded()"
                   (play)="onPlay()"
                   (pause)="onPause()"
                   (ended)="onPause()"
                   (error)="throwError('audio-not-loading', $event.message)">
            </audio>
            <label>
              Audio
            </label>
          </stars-media-player>
        </div>

        @if (elementModel().text && elementModel().text.trim()) {
          <div class="audio-text-wrapper">
            <p class="audio-instruction-text" [innerHTML]="formatText(elementModel().text)"></p>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .audio-instruction-container {
      display: block;
      width: auto;
    }

    .audio-button-wrapper {
      display: block;
      width: auto;
      max-width: clamp(150px, 15vw, 300px);
      margin-bottom: 0.75rem;
    }

    .audio-text-wrapper {
      display: block;
      width: 100%;
      clear: both;
    }

    .audio-instruction-text {
      margin: 0;
      padding: 0;
      max-width: clamp(150px, 20vw, 250px);
      font-size: clamp(0.7rem, 2vw, 1rem);
      color: #000;
      text-align: center;
      line-height: 1.3;
      width: auto;
      word-wrap: break-word;
      font-style: italic;
      display: block;
    }

    @media (max-width: 768px) {
      .audio-instruction-text {
        font-size: 0.9rem;
        max-width: 200px;
      }

      .audio-button-wrapper {
        margin-bottom: 0.5rem;
      }
    }

    @media (max-height: 600px) {
      .audio-instruction-text {
        font-size: 0.85rem;
      }

      .audio-button-wrapper {
        margin-bottom: 0.5rem;
      }
    }
  `],
  standalone: false
})
export class AudioComponent extends MediaPlayerElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<AudioElement>();
  @ViewChild('player', { static: false }) audioElementRef!: ElementRef<HTMLAudioElement>;
  private static hasUserInteracted = false;
  private static firstTouchListenersAdded = false;
  private static currentOverlay: HTMLElement | null = null;
  private audioElement: HTMLAudioElement | null = null;
  isPlaying: boolean = false;

  ngOnInit() {
    // console.log(this.elementModel());
    if (!AudioComponent.firstTouchListenersAdded) {
      this.setupFirstTouchListeners();
    }
  }

  ngOnDestroy() {
    this.removeOverlay();
    super.ngOnDestroy();
  }

  onAudioLoaded() {
    this.isLoaded.next(true);
    setTimeout(() => {
      if (this.audioElementRef?.nativeElement) {
        this.audioElement = this.audioElementRef.nativeElement;
        console.log('Audio element found via ViewChild:', this.audioElement);
      } else {
        console.warn('Audio element not found via ViewChild');
      }
    }, 100);
  }

  onPlay() {
    this.isPlaying = true;
  }

  onPause() {
    this.isPlaying = false;
  }

  valueChanged(event) {
    // console.log(event);
  }

  private setupFirstTouchListeners(): void {
    AudioComponent.firstTouchListenersAdded = true;
    console.log('Setting up first touch listeners with overlay method');

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '9999';
    overlay.style.backgroundColor = 'transparent';
    overlay.style.cursor = 'pointer';
    AudioComponent.currentOverlay = overlay;
    document.body.appendChild(overlay);

    const handleFirstInteraction = (event: Event) => {

      if (!AudioComponent.hasUserInteracted) {
        AudioComponent.hasUserInteracted = true;

        if (this.audioElement) {
          this.audioElement.play().then(() => {
          }).catch(error => {
            console.warn('Could not play audio on first touch:', error);
          });
        } else {
          const audioElement = document.querySelector('audio') as HTMLAudioElement;
          if (audioElement) {
            audioElement.play().catch(error => {
              console.warn('Fallback audio play failed:', error);
            });
          }
        }
        this.removeOverlay();
      }
    };
    overlay.addEventListener('click', handleFirstInteraction, { capture: true });
    overlay.addEventListener('touchstart', handleFirstInteraction, { capture: true });
    overlay.addEventListener('touchend', handleFirstInteraction, { capture: true });
    overlay.addEventListener('pointerdown', handleFirstInteraction, { capture: true });
    overlay.addEventListener('mousedown', handleFirstInteraction, { capture: true });
  }

  private removeOverlay(): void {
    if (AudioComponent.currentOverlay && AudioComponent.currentOverlay.parentNode) {
      document.body.removeChild(AudioComponent.currentOverlay);
      AudioComponent.currentOverlay = null;
    }
  }

  static reset(): void {
    AudioComponent.hasUserInteracted = false;
    AudioComponent.firstTouchListenersAdded = false;

    if (AudioComponent.currentOverlay && AudioComponent.currentOverlay.parentNode) {
      document.body.removeChild(AudioComponent.currentOverlay);
      AudioComponent.currentOverlay = null;
    }
  }

  formatText(text: string): string {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  }

  private sendPlaybackTimeChanged() {
    // if (this.currentTime > 0) {
    // this.valueChange.emit({
    //   id: this.elementModel().id,
    //   value: this.currentTime.toString(),
    //   status: "VALUE_CHANGED"
    // });
    // }
  }
}
