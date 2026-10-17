/**
 * Intelligent Progressive Frame Loader
 * Handles immediate first frame rendering, chunked preloading,
 * background caching, and smooth frame fallback.
 */

export class FrameLoader {
  constructor(options = {}) {
    this.totalFrames = options.totalFrames || 147;
    this.framePattern = options.framePattern || ((i) => `/frames/desktop/frame_${String(i).padStart(6, '0')}.webp`);
    this.initialBatchSize = options.initialBatchSize || 25;
    this.batchSize = options.batchSize || 10;
    this.onFirstFrameReady = options.onFirstFrameReady || null;
    this.onProgress = options.onProgress || null;

    this.cache = new Map();
    this.loading = new Set();
    this.loadedCount = 0;
    this.isDestroyed = false;
    this.nextQueueIndex = 1;
    this.isQueueProcessing = false;
  }

  /**
   * Start loading process.
   */
  start() {
    this.isDestroyed = false;
    // Step 1: Load frame 1 immediately
    this.loadFrame(1).then((img) => {
      if (this.isDestroyed) return;
      if (this.onFirstFrameReady && img) {
        this.onFirstFrameReady(img);
      }
      // Step 2: Preload initial batch
      this.preloadInitialBatch();
    });
  }

  /**
   * Preload initial batch of frames.
   */
  async preloadInitialBatch() {
    if (this.isDestroyed) return;
    const end = Math.min(this.initialBatchSize, this.totalFrames);
    const promises = [];
    for (let i = 2; i <= end; i++) {
      promises.push(this.loadFrame(i));
    }
    await Promise.allSettled(promises);
    if (this.isDestroyed) return;

    // Step 3: Start background progressive loading
    this.nextQueueIndex = end + 1;
    this.processBackgroundQueue();
  }

  /**
   * Background loader loop using requestIdleCallback or setTimeout
   */
  processBackgroundQueue() {
    if (this.isDestroyed || this.nextQueueIndex > this.totalFrames) {
      return;
    }

    const scheduleNext = window.requestIdleCallback || ((cb) => setTimeout(cb, 16));

    scheduleNext(async (deadline) => {
      if (this.isDestroyed) return;

      const end = Math.min(this.nextQueueIndex + this.batchSize - 1, this.totalFrames);
      const promises = [];

      for (let i = this.nextQueueIndex; i <= end; i++) {
        promises.push(this.loadFrame(i));
      }

      this.nextQueueIndex = end + 1;
      await Promise.allSettled(promises);

      if (!this.isDestroyed && this.nextQueueIndex <= this.totalFrames) {
        this.processBackgroundQueue();
      }
    });
  }

  /**
   * Load and cache an individual frame by 1-based index.
   */
  loadFrame(index) {
    if (this.cache.has(index)) {
      return Promise.resolve(this.cache.get(index));
    }

    if (this.loading.has(index)) {
      // Return a promise waiting for the image to be cached
      return new Promise((resolve) => {
        const check = () => {
          if (this.cache.has(index)) resolve(this.cache.get(index));
          else if (!this.loading.has(index)) resolve(null);
          else requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      });
    }

    this.loading.add(index);

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const cleanup = () => {
        this.loading.delete(index);
      };

      img.onload = async () => {
        if (this.isDestroyed) {
          cleanup();
          resolve(null);
          return;
        }

        try {
          if ('decode' in img) {
            await img.decode();
          }
        } catch {
          // Ignore decode errors, image is still valid
        }

        this.cache.set(index, img);
        this.loadedCount++;
        cleanup();

        if (this.onProgress) {
          this.onProgress({
            loaded: this.loadedCount,
            total: this.totalFrames,
            percent: Math.round((this.loadedCount / this.totalFrames) * 100)
          });
        }

        resolve(img);
      };

      img.onerror = () => {
        cleanup();
        resolve(null);
      };

      img.src = this.framePattern(index);
    });
  }

  /**
   * Retrieve a frame for a given index (1-based).
   * If exact frame is not yet loaded, find the closest loaded frame to prevent blank screen.
   */
  getFrame(index) {
    const clamped = Math.max(1, Math.min(index, this.totalFrames));

    if (this.cache.has(clamped)) {
      return this.cache.get(clamped);
    }

    // Eagerly request this frame in case user scrolled ahead
    this.loadFrame(clamped);

    // Also prefetch next few frames in the forward direction
    for (let offset = 1; offset <= 4; offset++) {
      if (clamped + offset <= this.totalFrames) {
        this.loadFrame(clamped + offset);
      }
    }

    // Nearest-neighbor search in cache to prevent blank flashing
    let closestIndex = -1;
    let minDistance = Infinity;

    for (const key of this.cache.keys()) {
      const dist = Math.abs(key - clamped);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = key;
      }
    }

    if (closestIndex !== -1) {
      return this.cache.get(closestIndex);
    }

    return null;
  }

  destroy() {
    this.isDestroyed = true;
    this.cache.clear();
    this.loading.clear();
  }
}
