import {
  AfterViewInit,
  Component, effect, ElementRef, signal, ViewChild, OnDestroy
} from '@angular/core';

import { Response } from '@iqbspecs/response/response.interface';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionFindOnImageParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-interaction-find-on-image',
  templateUrl: './find-on-image.component.html',
  standalone: true,
  styleUrls: ['./find-on-image.component.scss']
})

export class InteractionFindOnImageComponent extends InteractionComponentDirective implements AfterViewInit, OnDestroy {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: InteractionFindOnImageParams;
  /** Whether to apply the show area style to the image. */
  pendingShowArea = false;
  /** Signal holding the CSS `top` position (px) for the click visual indicator. */
  clickTargetTop = signal('0px');
  /** Signal holding the CSS `left` position (px) for the click visual indicator. */
  clickTargetLeft = signal('0px');
  /** Signal holding the CSS size(px) for the click visual indicator. */
  clickTargetSize = signal('0px');
  /** Template reference to the image DOM node */
  @ViewChild('imageElement', { static: false }) imageRef!: ElementRef<HTMLImageElement>;
  /** Signal that controls whether the clickTarget button is disabled. */
  buttonDisabled = signal(true);
  /** Signal holding inline CSS for the optional show-area overlay (top/left/width/height). */
  showAreaStyle = signal('');
  /** Boolean to track if the former state has been restored from response. */
  private hasRestoredFromFormerState = false;
  /** The last restored value to avoid redundant restorations within the same unit. */
  private lastRestoredValue = '';
  /** The currently loaded unit identity (variableId + imageSource). */
  private currentUnitIdentity = '';
  /** Temporarily stores a Response to be restored later when the image DOM node is available. */
  private pendingRestoreResponse: Response | null = null;
  /** Reference to the native HTMLImageElement. */
  private cachedImgEl: HTMLImageElement | null = null;
  /** Image width in pixels (read from the native element). */
  private imgWidth = 0;
  /** Image height in pixels (read from the native element). */
  private imgHeight = 0;
  /** Image top offset in pixels relative to the layout/offset parent. */
  private imgTop = 0;
  /** Image left offset in pixels relative to the layout/offset parent. */
  private imgLeft = 0;
  /** Image load event handler. */
  private imageLoadHandler: ((ev?: Event) => void) | null = null;
  /** Reference to the pending restoration timer. */
  private restoreTimer: ReturnType<typeof setTimeout> | null = null;
  /** Tracks the last seen parameters object reference to detect new vopStartCommand loads even if identity is the same. */
  private lastParametersRef: unknown | null = null;

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionFindOnImageParams;
      if (!parameters) return;

      // Detect a brand-new vopStartCommand by reference change of parameters object
      const isNewParametersObject = this.lastParametersRef !== parameters;
      if (isNewParametersObject) {
        this.lastParametersRef = parameters;
        // Always clear visuals and allow a fresh init/restore for this load
        this.resetVisualState();
        this.hasRestoredFromFormerState = false;
        this.lastRestoredValue = '';
        // Reset identity so we recompute it below
        this.currentUnitIdentity = '';
        this.localParameters = this.createDefaultParameters();
      }

      const newVariableId = parameters.variableId || 'FIND_ON_IMAGE';
      const newImageSource = parameters.imageSource || '';
      const newText = parameters.text || '';
      const newShowArea = parameters.showArea || '';
      const newSize = parameters.size || 'SMALL';
      // Create an identity string from all unit definition parameters (NOT including formerState)
      const newIdentity = `${newVariableId}|${newImageSource}|${newText}|${newShowArea}|${newSize}`;

      // 1. New unit identity check: reset flags if the definition actually differs
      if (this.currentUnitIdentity !== newIdentity) {
        // Only reset flags here; visuals already cleared above on new parameters object
        this.currentUnitIdentity = newIdentity;
        this.lastRestoredValue = '';
        this.hasRestoredFromFormerState = false;
        // Also clear cached image ref so we don't use stale one
        this.cachedImgEl = null;
      }

      // 2. Update localParameters with incoming parameter values
      this.localParameters.variableId = newVariableId;
      this.localParameters.imageSource = newImageSource;
      this.localParameters.text = newText;
      this.localParameters.showArea = newShowArea;
      this.localParameters.size = newSize;

      if (this.localParameters.showArea) {
        if (this.imageRef) {
          this.setShowArea();
        } else {
          this.pendingShowArea = true;
        }
      }

      // 3. One-time initialization/restoration logic for the current load
      if (!this.hasRestoredFromFormerState) {
        const formerStateResponses: Response[] = parameters.formerState || [];
        const foundResponse = Array.isArray(formerStateResponses) ?
          formerStateResponses.find(r => r.id === this.localParameters.variableId) :
          null;

        if (foundResponse && foundResponse.value) {
          // Only call restore if the value is different from what's currently shown/captured
          if (foundResponse.value !== this.lastRestoredValue) {
            if (this.imageRef && this.imageRef.nativeElement) {
              this.restoreFromFormerState(foundResponse);
            } else {
              this.pendingRestoreResponse = foundResponse;
            }
            this.lastRestoredValue = foundResponse.value as string;
          }
          this.hasRestoredFromFormerState = true;
        } else {
          // Force UI to clear visuals when initializing as new
          this.buttonDisabled.set(true);
          this.clickTargetTop.set('0px');
          this.clickTargetLeft.set('0px');
          this.clickTargetSize.set('0px');

          // No former state: emit DISPLAYED only once for this load
          this.responses.emit([{
            id: this.localParameters.variableId,
            status: 'DISPLAYED',
            value: '',
            relevantForResponsesProgress: false
          }]);
          this.hasRestoredFromFormerState = true;
          this.lastRestoredValue = '';
        }
      }
    });
  }

  /**
   * Resets all visual and internal state variables to their defaults.
   * This is called whenever the component parameters change to ensure no leakage between units.
   */
  private resetVisualState(): void {
    this.buttonDisabled.set(true);
    this.clickTargetTop.set('0px');
    this.clickTargetLeft.set('0px');
    this.clickTargetSize.set('0px');
    this.showAreaStyle.set('');
    this.pendingShowArea = false;
    this.pendingRestoreResponse = null;
    this.cachedImgEl = null;
    this.imgWidth = 0;
    this.imgHeight = 0;
    this.imgLeft = 0;
    this.imgTop = 0;
    if (this.restoreTimer) {
      clearTimeout(this.restoreTimer);
      this.restoreTimer = null;
    }
  }

  private updateImageMetrics(): void {
    const imgEl = this.imageRef?.nativeElement || null;
    if (!imgEl) {
      this.cachedImgEl = null;
      this.imgWidth = 0;
      this.imgHeight = 0;
      this.imgTop = 0;
      this.imgLeft = 0;
      return;
    }
    this.cachedImgEl = imgEl;

    // Compute metrics from actual rendered geometry to match visual placement
    // Using offsetLeft and offsetTop which are relative to the offsetParent (image-wrapper)
    this.imgWidth = imgEl.width || imgEl.naturalWidth;
    this.imgHeight = imgEl.height || imgEl.naturalHeight;
    this.imgLeft = imgEl.offsetLeft;
    this.imgTop = imgEl.offsetTop;
  }

  ngAfterViewInit() {
    this.updateImageMetrics();

    // attached a persistent image load listener so metrics become available when the image finishes loading
    if (this.imageRef && this.imageRef.nativeElement) {
      const el = this.imageRef.nativeElement;
      if (!this.imageLoadHandler) {
        this.imageLoadHandler = () => {
          this.updateImageMetrics();
          if (this.pendingShowArea) {
            this.setShowArea();
            this.pendingShowArea = false;
          }
          // if a restore was pending, try it now
          if (this.pendingRestoreResponse) {
            const pending = this.pendingRestoreResponse;
            this.pendingRestoreResponse = null;
            this.restoreFromFormerState(pending);
          }
        };
      }
      el.addEventListener('load', this.imageLoadHandler);
    }

    if (this.pendingShowArea) {
      this.updateImageMetrics();
      this.setShowArea();
      this.pendingShowArea = false;
    }
    if (this.pendingRestoreResponse) {
      // try restore now, but the function will re-schedule itself if image is not ready
      const pending = this.pendingRestoreResponse;
      this.pendingRestoreResponse = null;
      this.restoreFromFormerState(pending);
    }
  }

  ngOnDestroy() {
    if (this.imageLoadHandler && this.imageRef && this.imageRef.nativeElement) {
      this.imageRef.nativeElement.removeEventListener('load', this.imageLoadHandler);
      this.imageLoadHandler = null;
    }
    if (this.restoreTimer) {
      clearTimeout(this.restoreTimer);
      this.restoreTimer = null;
    }
  }

  setShowArea() {
    this.updateImageMetrics();
    if (!this.localParameters || !this.localParameters.showArea) return;
    const area = this.localParameters.showArea.match(/\d+/g);
    if (!area || area.length < 4 || this.imgWidth === 0) return;

    const imgWidthFactor = this.imgWidth / 100;
    const imgHeightFactor = this.imgHeight / 100;

    const x1 = Math.round((Number.parseInt(area[0]!, 10) * imgWidthFactor) + this.imgLeft);
    const y1 = Math.round((Number.parseInt(area[1]!, 10) * imgHeightFactor) + this.imgTop);
    const x2 = Math.round((Number.parseInt(area[2]!, 10) * imgWidthFactor) + this.imgLeft);
    const y2 = Math.round((Number.parseInt(area[3]!, 10) * imgHeightFactor) + this.imgTop);
    this.showAreaStyle.set(`top: ${y1}px; left: ${x1}px; width: ${x2 - x1}px; height: ${y2 - y1}px;`);
  }

  setClickVisualisationAbsolute(x: number, y: number, imageWidth: number) {
    this.clickTargetLeft.set(`${x}px`);
    this.clickTargetTop.set(`${y}px`);
    let sizeFactor = 5;
    if (this.localParameters.size !== 'SMALL') sizeFactor = this.localParameters.size === 'LARGE' ? 15 : 10;
    this.clickTargetSize.set(`${sizeFactor * (imageWidth / 100)}px`);
    if (this.buttonDisabled()) this.buttonDisabled.set(false);
  }

  onClick(event: any) {
    this.updateImageMetrics();
    if (this.imgWidth === 0 || this.cachedImgEl == null) return;

    this.setClickVisualisationAbsolute(event.layerX, event.layerY, this.imgWidth);

    const x = Math.round(((event.layerX - this.imgLeft) / this.imgWidth) * 100);
    const y = Math.round(((event.layerY - this.imgTop) / this.imgHeight) * 100);
    this.lastRestoredValue = `${x},${y}`;

    this.responses.emit([{
      id: this.localParameters.variableId || 'FIND_ON_IMAGE',
      status: 'VALUE_CHANGED',
      value: `${x},${y}`,
      relevantForResponsesProgress: true
    }]);
  }

  /**
   * Restores the selection state based on user interaction.
   * @param {Response} response - The response object containing a string `value` in the form "x,y" (percent values).
   */
  private restoreFromFormerState(response: Response): void {
    if (!response.value || typeof response.value !== 'string') return;

    const parts = response.value.split(',').map(p => p.trim());
    if (parts.length < 2) return;

    const percentX = Number.parseInt(parts[0]!, 10);
    const percentY = Number.parseInt(parts[1]!, 10);
    if (Number.isNaN(percentX) || Number.isNaN(percentY)) return;

    this.updateImageMetrics();

    // If image element is not present or not loaded yet, attach a one time load listener
    if (!this.cachedImgEl) {
      // schedule restore for after view init / load
      this.pendingRestoreResponse = response;
      return;
    }

    const imgEl = this.cachedImgEl;

    // Check if the current image source matches what we expect from parameters
    // This prevents using metrics from a previous image that hasn't swapped out yet
    const currentSrc = imgEl.getAttribute('src');
    const expectedSrc = this.localParameters.imageSource;
    const isDifferentImage = expectedSrc && currentSrc && !currentSrc.includes(expectedSrc);

    const imageNotReady = (!imgEl.complete) || this.imgWidth === 0 || this.imgHeight === 0 || isDifferentImage;
    if (imageNotReady) {
      const oneTimeHandler = () => {
        imgEl.removeEventListener('load', oneTimeHandler);
        this.updateImageMetrics();
        this.restoreFromFormerState(response);
      };
      imgEl.addEventListener('load', oneTimeHandler);
      return;
    }

    // convert percent to pixels within image
    const xWithinImage = Math.round((percentX / 100) * this.imgWidth);
    const yWithinImage = Math.round((percentY / 100) * this.imgHeight);

    // compute absolute coordinates consistent with the onClick usage
    const xAbs = Math.max(this.imgLeft, Math.min(this.imgLeft + this.imgWidth, this.imgLeft + xWithinImage));
    const yAbs = Math.max(this.imgTop, Math.min(this.imgTop + this.imgHeight, this.imgTop + yWithinImage));

    this.setClickVisualisationAbsolute(xAbs, yAbs, this.imgWidth);
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionFindOnImageParams {
    return {
      variableId: '',
      imageSource: '',
      text: '',
      showArea: '',
      size: 'SMALL'
    };
  }
}
