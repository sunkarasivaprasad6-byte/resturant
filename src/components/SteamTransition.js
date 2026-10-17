/**
 * Atmospheric Steam Transition
 * Harmonizes with the WebP frame sequence steam by smoothly generating
 * warm, soft, billowy rising mist that gently obscures the frame as scroll reaches 100%.
 * Fully reversible upon scrolling backward.
 */

export class SteamTransition {
  constructor(containerElement) {
    this.container = containerElement;
    this.steamOverlay = null;
    this.init();
  }

  init() {
    this.steamOverlay = document.createElement('div');
    this.steamOverlay.className = 'steam-transition-overlay';
    this.steamOverlay.setAttribute('aria-hidden', 'true');
    this.steamOverlay.innerHTML = `
      <div class="steam-layer steam-ambient"></div>
      <div class="steam-layer steam-plume steam-plume-1"></div>
      <div class="steam-layer steam-plume steam-plume-2"></div>
      <div class="steam-layer steam-plume steam-plume-3"></div>
      <div class="steam-layer steam-density"></div>
    `;
    this.container.appendChild(this.steamOverlay);
  }

  /**
   * Update steam transition based on normalized progress [0.0 - 1.0]
   * Active during the final stage (e.g. 0.84 to 1.00).
   */
  update(scrollProgress, startThreshold = 0.84, peakThreshold = 0.96, endThreshold = 1.0) {
    if (!this.steamOverlay) return;

    if (scrollProgress < startThreshold) {
      this.steamOverlay.style.opacity = '0';
      this.steamOverlay.style.pointerEvents = 'none';
      return;
    }

    // Normalized steam progress 0 to 1
    const t = Math.min(1, Math.max(0, (scrollProgress - startThreshold) / (endThreshold - startThreshold)));
    
    // Smooth cinematic curve
    const smoothT = t * t * (3 - 2 * t);

    this.steamOverlay.style.opacity = smoothT.toString();

    // Subtle upward drift of steam plumes controlled by scroll
    const plume1 = this.steamOverlay.querySelector('.steam-plume-1');
    const plume2 = this.steamOverlay.querySelector('.steam-plume-2');
    const plume3 = this.steamOverlay.querySelector('.steam-plume-3');
    const density = this.steamOverlay.querySelector('.steam-density');

    if (plume1) plume1.style.transform = `translateY(${-smoothT * 80}px) scale(${1 + smoothT * 0.15})`;
    if (plume2) plume2.style.transform = `translateY(${-smoothT * 120}px) scale(${1 + smoothT * 0.2})`;
    if (plume3) plume3.style.transform = `translateY(${-smoothT * 60}px) scale(${1 + smoothT * 0.1})`;
    if (density) density.style.opacity = Math.max(0, (t - 0.5) * 2).toString();
  }

  destroy() {
    if (this.steamOverlay && this.steamOverlay.parentNode) {
      this.steamOverlay.parentNode.removeChild(this.steamOverlay);
    }
  }
}
