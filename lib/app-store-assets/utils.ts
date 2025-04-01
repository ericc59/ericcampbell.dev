import type { TemplateConfig } from './config';

/**
 * Generates a resized version of an image.
 * @param imageDataUrl - The data URL of the original image.
 * @param targetWidth - The desired width.
 * @param targetHeight - The desired height (defaults to targetWidth for square images).
 * @returns A promise resolving to the data URL of the resized image (PNG format).
 */
export const generateResizedImage = (
  imageDataUrl: string,
  targetWidth: number,
  targetHeight: number = targetWidth
): Promise<string> => {
  // Ensure we are in a browser environment
  if (typeof Image === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(
      new Error('Image processing requires a browser environment.')
    );
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (error) => {
      console.error('Image load error during resize:', error);
      reject(new Error('Failed to load image for resizing'));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Converts a data URL string to a Blob object.
 * @param dataurl - The data URL to convert.
 * @returns A Blob object or null if conversion fails.
 */
export const dataURLToBlob = (dataurl: string): Blob | null => {
  const arr = dataurl.split(',');
  if (arr.length < 2) return null;
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) return null;
  const mime = mimeMatch[1];
  // Check if running in a browser environment before using atob
  if (
    typeof atob === 'undefined' ||
    typeof Uint8Array === 'undefined' ||
    typeof Blob === 'undefined'
  ) {
    console.error(
      'Blob conversion requires a browser environment with atob, Uint8Array, and Blob support.'
    );
    return null;
  }
  try {
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (error) {
    console.error('Error converting data URL to Blob:', error);
    return null;
  }
};

// Cache for loaded images (both screenshots and frames) to avoid re-downloading/re-processing
const imageCache: { [url: string]: Promise<HTMLImageElement> } = {};

/**
 * Loads an image and caches the promise.
 * If the image is already cached and loaded, resolves immediately.
 * If the image is cached but still loading, returns the existing promise.
 * @param src - The source URL or data URL of the image.
 * @returns A promise resolving to the loaded HTMLImageElement.
 */
const loadAndCacheImage = (src: string): Promise<HTMLImageElement> => {
  // Check if the promise already exists in the cache
  if (src in imageCache) {
    return imageCache[src]; // Return the existing promise
  }

  // Ensure we are in a browser environment
  if (typeof Image === 'undefined') {
    const error = new Error('Image loading requires a browser environment.');
    imageCache[src] = Promise.reject(error); // Cache the rejected promise
    return imageCache[src];
  }

  // If not cached, create a new promise
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => {
      console.error(`Failed to load image: ${src}`, error);
      delete imageCache[src]; // Important: Remove failed promise from cache
      reject(new Error(`Failed to load image: ${src}`));
    };
    // Potentially handle cross-origin issues if loading external images
    // img.crossOrigin = "Anonymous";
    img.src = src; // Start loading the image
  });

  // Store the new promise in the cache
  imageCache[src] = promise;
  return promise;
};

/**
 * Applies a template (background, optional PROGRAMMATIC frame) to a screenshot.
 * Uses cached screenshot images for performance.
 * Accepts override values for frame/padding.
 */
export const applyTemplateToScreenshot = async (
  screenshotUrl: string,
  targetWidth: number,
  targetHeight: number,
  template: TemplateConfig, // Base template config
  // Background overrides
  bgColor: string,
  gradStart: string,
  gradEnd: string,
  // Frame overrides
  frameColor: string,
  frameThickness: number,
  frameOuterRadius: number,
  frameInnerRadius: number,
  // Padding override (used if template has no frame)
  paddingValue: number,
  // Outer Padding override (used if template *has* a frame)
  frameOuterPadding: number
): Promise<string> => {
  if (typeof document === 'undefined') {
    throw new Error('Cannot create canvas outside of a browser environment.');
  }

  try {
    const screenshotImg = await loadAndCacheImage(screenshotUrl);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // --- 1. Draw Background ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (template.backgroundType === 'color') {
      ctx.fillStyle = bgColor; // Use passed background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (template.backgroundType === 'gradient') {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, gradStart); // Use passed gradient start
      gradient.addColorStop(1, gradEnd); // Use passed gradient end
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // --- 2. Draw Frame (if defined in template) and Screenshot ---
    if (template.frame) {
      const color = frameColor;
      const thickness = frameThickness;
      const outerRadius = frameOuterRadius;
      const innerRadius = frameInnerRadius;
      const outerPadding = frameOuterPadding; // Use the new outer padding value

      // Calculate frame position and size based on outer padding
      const frameDrawX = outerPadding;
      const frameDrawY = outerPadding;
      const frameDrawWidth = canvas.width - outerPadding * 2;
      const frameDrawHeight = canvas.height - outerPadding * 2;

      if (frameDrawWidth <= 0 || frameDrawHeight <= 0) {
        throw new Error(
          `Outer padding (${outerPadding}px) is too large for the canvas dimensions.`
        );
      }

      // A. Draw the outer frame/bezel at the calculated position/size
      ctx.fillStyle = color;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(
          frameDrawX,
          frameDrawY,
          frameDrawWidth,
          frameDrawHeight,
          outerRadius
        );
      } else {
        console.warn(
          'ctx.roundRect not supported, using square corners for outer frame.'
        );
        ctx.rect(frameDrawX, frameDrawY, frameDrawWidth, frameDrawHeight);
      }
      ctx.fill();

      // B. Prepare the screen area relative to the frame's position
      const screenX = frameDrawX + thickness;
      const screenY = frameDrawY + thickness;
      const screenWidth = frameDrawWidth - thickness * 2;
      const screenHeight = frameDrawHeight - thickness * 2;

      if (screenWidth <= 0 || screenHeight <= 0) {
        throw new Error(
          `Frame thickness (${thickness}px) is too large for the frame dimensions determined by outer padding.`
        );
      }

      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(screenX, screenY, screenWidth, screenHeight, innerRadius);
      } else {
        console.warn(
          'ctx.roundRect not supported, using square corners for screen.'
        );
        ctx.rect(screenX, screenY, screenWidth, screenHeight);
      }
      ctx.clip();

      // C. Draw the screenshot within the clipped screen area
      const screenshotAspectRatio = screenshotImg.width / screenshotImg.height;
      const screenAspectRatio = screenWidth / screenHeight;
      let drawWidth, drawHeight, drawX, drawY;

      if (screenshotAspectRatio > screenAspectRatio) {
        drawWidth = screenWidth;
        drawHeight = drawWidth / screenshotAspectRatio;
        drawX = screenX;
        drawY = screenY + (screenHeight - drawHeight) / 2;
      } else {
        drawHeight = screenHeight;
        drawWidth = drawHeight * screenshotAspectRatio;
        drawY = screenY;
        drawX = screenX + (screenWidth - drawWidth) / 2;
      }

      if (drawWidth > 0 && drawHeight > 0) {
        ctx.drawImage(screenshotImg, drawX, drawY, drawWidth, drawHeight);
      } else {
        console.warn(
          'Calculated screenshot draw dimensions are zero or negative within frame.',
          { drawWidth, drawHeight, drawX, drawY }
        );
      }

      ctx.restore();
    } else {
      // --- No frame: Draw screenshot with padding ---
      // Use the passed-in override value for padding
      const padding = paddingValue;
      const contentWidth = canvas.width - padding * 2;
      const contentHeight = canvas.height - padding * 2;

      if (contentWidth <= 0 || contentHeight <= 0) {
        throw new Error(
          `Invalid padding (${padding}px) for ${template.name}: results in zero or negative content dimensions`
        );
      }

      const screenshotAspectRatio = screenshotImg.width / screenshotImg.height;
      const contentAspectRatio = contentWidth / contentHeight;
      let drawWidth, drawHeight, drawX, drawY;

      if (screenshotAspectRatio > contentAspectRatio) {
        drawWidth = contentWidth;
        drawHeight = drawWidth / screenshotAspectRatio;
        drawX = padding;
        drawY = padding + (contentHeight - drawHeight) / 2;
      } else {
        drawHeight = contentHeight;
        drawWidth = drawHeight * screenshotAspectRatio;
        drawY = padding;
        drawX = padding + (contentWidth - drawWidth) / 2;
      }

      if (drawWidth <= 0 || drawHeight <= 0) {
        console.warn('Calculated draw dimensions are zero or negative.', {
          drawWidth,
          drawHeight,
          drawX,
          drawY,
        });
      } else {
        ctx.drawImage(screenshotImg, drawX, drawY, drawWidth, drawHeight);
      }
    }

    // --- 3. Return final image ---
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error applying template:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to apply template: ${message}`);
  }
};
