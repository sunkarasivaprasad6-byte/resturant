/**
 * High-Performance Canvas Renderer
 * Handles DPR scaling, cover aspect-ratio preservation,
 * and RAF rendering loop with dirty checking.
 */

export class CanvasRenderer {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.aspectRatio = options.aspectRatio || (16 / 9);

    this.currentFrame = null;
    this.isDirty = false;
    this.animationFrameId = null;

    this.viewportWidth = 0;
    this.viewportHeight = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.init();
  }

  init() {
    this.resize();
    this.startLoop();
  }

  setAspectRatio(ratio) {
    if (this.aspectRatio !== ratio) {
      this.aspectRatio = ratio;
      this.isDirty = true;
    }
  }

  resize() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Set display size (CSS pixels)
    this.canvas.style.width = `${this.viewportWidth}px`;
    this.canvas.style.height = `${this.viewportHeight}px`;

    // Set actual render buffer size (scaled for high DPR)
    this.canvas.width = Math.round(this.viewportWidth * this.dpr);
    this.canvas.height = Math.round(this.viewportHeight * this.dpr);

    // Reset transform and apply DPR scale
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    this.isDirty = true;
  }

  renderFrame(image) {
    if (!image) return;
    if (this.currentFrame !== image) {
      this.currentFrame = image;
      this.isDirty = true;
    }
  }

  startLoop() {
    const loop = () => {
      if (this.isDirty) {
        this.draw();
        this.isDirty = false;
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  draw() {
    if (!this.currentFrame) return;

    const img = this.currentFrame;
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    if (!imgWidth || !imgHeight) return;

    const imgAspect = imgWidth / imgHeight;
    const screenAspect = this.viewportWidth / this.viewportHeight;

    let drawWidth, drawHeight, drawX, drawY;

    // "cover" math: fill entire viewport without black bars or distortion
    if (screenAspect > imgAspect) {
      drawWidth = this.viewportWidth;
      drawHeight = this.viewportWidth / imgAspect;
      drawX = 0;
      drawY = (this.viewportHeight - drawHeight) / 2;
    } else {
      drawHeight = this.viewportHeight;
      drawWidth = this.viewportHeight * imgAspect;
      drawX = (this.viewportWidth - drawWidth) / 2;
      drawY = 0;
    }

    // Draw the image
    this.ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
