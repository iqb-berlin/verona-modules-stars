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

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionFindOnImageParams;
      this.localParameters = this.createDefaultParameters();
      this.hasRestoredFromFormerState = false;
      this.buttonDisabled.set(true);
      if (parameters) {
        this.localParameters.variableId = parameters.variableId || 'FIND_ON_IMAGE';
        this.localParameters.imageSource = parameters.imageSource || '';
        this.localParameters.text = parameters.text || '';
        this.localParameters.showArea = parameters.showArea || '';
        this.localParameters.size = parameters.size || 'SMALL';
        if (this.localParameters.showArea) {
          if (this.imageRef) {
            this.setShowArea();
          } else {
            this.pendingShowArea = true;
          }
        }
        // Only restore from former state once, on initial load
        if (!this.hasRestoredFromFormerState) {
          const formerStateResponses: Response[] = parameters.formerState || [];

          if (Array.isArray(formerStateResponses) && formerStateResponses.length > 0) {
            const foundResponse = formerStateResponses.find(r => r.id === this.localParameters.variableId);

            if (foundResponse && foundResponse.value) {
              // If image is ready, restore now, otherwise store pending restore for ngAfterViewInit
              if (this.imageRef && this.imageRef.nativeElement) {
                this.restoreFromFormerState(foundResponse);
              } else {
                this.pendingRestoreResponse = foundResponse;
              }
              this.hasRestoredFromFormerState = true;
              return;
            }
          }

          // No former state - initialize as new
          this.responses.emit([{
            id: this.localParameters.variableId,
            status: 'DISPLAYED',
            value: ''
          }]);
          this.hasRestoredFromFormerState = true;
        }
      }
    });
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
    this.imgWidth = imgEl.width;
    this.imgHeight = imgEl.height;
    this.imgTop = imgEl.offsetTop;
    this.imgLeft = imgEl.offsetLeft;
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
  }

  setShowArea() {
    this.updateImageMetrics();
    const area = this.localParameters?.showArea?.match(/\d+/g);
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

    this.responses.emit([{
      id: this.localParameters.variableId || 'FIND_ON_IMAGE',
      status: 'VALUE_CHANGED',
      value: `${x},${y}`
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
    const imageNotReady = (!imgEl.complete) || this.imgWidth === 0 || this.imgHeight === 0;
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
