/**
 * Calculates the pixel translation needed to move an element (e.g., a button)
 * so its center aligns with a target position on an image,
 * based on percentage coordinates. Considers the image's size and position,
 * the button's current center, and a fixed gap between buttons.
 * @param xyCoords - Comma-separated x,y coordinates (percentages 0-100) for the target position on the image
 * @param currentButtonCenterX - Current x-coordinate of the button's center within the container
 * @param imageWidth - Width of the image in pixels
 * @param imageHeight - Height of the image in pixels
 * @param imageLeft - Left offset of the image relative to the container
 * @param imageTop - Top offset of the image relative to the container
 * @param currentButtonCenterY - Current y-coordinate of the button's center within the container
 * @returns An object with x and y translation values in pixels, formatted for CSS transforms
 */
export const getDropLandingTranslate = (
  xyCoords: string,
  currentButtonCenterX: number,
  imageWidth: number,
  imageHeight: number,
  imageLeft: number,
  imageTop: number,
  currentButtonCenterY: number
) => {
  const coords = xyCoords.split(',');
  const x = coords[0]?.trim() ?? '50';
  const y = coords[1]?.trim() ?? '50';
  const gapSize = 24; // Gap between buttons in px

  // Calculate target position within the image bounds
  // 0,0 = top-left corner, 50,50 = center, 100,100 = bottom-right corner
  const targetXWithinImage = (parseInt(x, 10) / 100) * imageWidth;
  const targetYWithinImage = (parseInt(y, 10) / 100) * imageHeight;

  // Convert to absolute position by adding image's position
  const absoluteTargetX = imageLeft + targetXWithinImage;
  const absoluteTargetY = imageTop + targetYWithinImage;

  // Calculate movement needed from button's current position
  // The button is already positioned at currentButtonCenterX/Y
  // We need to move it to absoluteTargetX/Y
  const deltaX = absoluteTargetX - currentButtonCenterX + gapSize / 2;
  const deltaY = absoluteTargetY - currentButtonCenterY + gapSize / 2;

  // Apply requested offsets: x should be +10px more, y should be -10px less
  const transformedDeltaX = formatPxValue((deltaX - 10).toString());
  const transformedDeltaY = formatPxValue((deltaY - 10).toString());

  return {
    xPx: transformedDeltaX,
    yPx: transformedDeltaY
  };
};

/**
 * Calculates positional arguments for aligning a button with a target location on an image inside a container.
 * @param imgElement - The image element used for drop landing calculations
 * @param buttonElement - The button element to be positioned
 * @param containerElement - The container element holding the image and button
 * @returns {buttonCenterX: number; imgWidth: number; imgHeight: number; imageLeft: number; imageTop: number; buttonCenterY: number;}
 *   An object containing the button's center coordinates, image dimensions, and image offset relative to the container
 */
export const getDropLandingArgs = (
  imgElement: HTMLImageElement,
  buttonElement: HTMLElement,
  containerElement: HTMLElement
) : { buttonCenterX: number;
  imgWidth: number;
  imgHeight: number;
  imageLeft: number;
  imageTop: number;
  buttonCenterY: number;
} => {
  if (!buttonElement) {
    throw new Error('buttonElement is undefined or not found in the DOM');
  }
  // Use consistent measurement system: DOMRect relative to viewport for image, button, and container
  const containerRect = containerElement.getBoundingClientRect();
  const imgRect = imgElement.getBoundingClientRect();
  const buttonRect = buttonElement.getBoundingClientRect();

  // Compute centers relative to the same container coordinate space to avoid Firefox rounding/offset issues
  const buttonCenterX = (buttonRect.left - containerRect.left) + (buttonRect.width / 2);
  const buttonCenterY = (buttonRect.top - containerRect.top) + (buttonRect.height / 2);

  const imageLeft = imgRect.left - containerRect.left;
  const imageTop = imgRect.top - containerRect.top;

  return {
    buttonCenterX,
    imgWidth: imgRect.width,
    imgHeight: imgRect.height,
    imageLeft,
    imageTop,
    buttonCenterY
  };
};

/** Formats a string as a pixel value, rounding to three decimal places if necessary.
 * If the value has more than three decimal places, rounds to three; otherwise,
 * keeps original precision.
 * @param value - The string to format as a pixel value
 * @returns A string representing the value in pixels (e.g., 123.456px)
 * */
export const formatPxValue = (value: string): string => {
  const num = Number(String(value).replace(/[^-0-9.]/g, ''));
  if (Number.isNaN(num)) return value; // fallback if not a number
  const rounded = Math.round(num); // Round to the nearest integer
  return `${rounded}px`;
};
