import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Timeline Controller
 * Orchestrates GSAP ScrollTrigger pinning, frame scrubbing,
 * text stage transitions, and steam effect.
 */
export class HeroTimeline {
  constructor({
    wrapperElement,
    pinnedViewport,
    stages,
    totalFrames,
    frameLoader,
    canvasRenderer,
    steamTransition,
    progressBar,
    scrollDistance
  }) {
    this.wrapper = wrapperElement;
    this.viewport = pinnedViewport;
    this.stages = stages;
    this.totalFrames = totalFrames;
    this.frameLoader = frameLoader;
    this.canvasRenderer = canvasRenderer;
    this.steamTransition = steamTransition;
    this.progressBar = progressBar;
    this.scrollDistance = scrollDistance;

    this.scrollTrigger = null;
    this.stageElements = [];
    this.lastRenderedIndex = -1;

    this.init();
  }

  init() {
    // Cache DOM stage elements
    this.stageElements = this.stages.map((stage) => {
      const el = document.getElementById(`stage-${stage.id.replace('phase-', '')}`);
      return {
        ...stage,
        el
      };
    });

    this.setupScrollTrigger();
  }

  setupScrollTrigger() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }

    const distance = typeof this.scrollDistance === 'function' 
      ? this.scrollDistance() 
      : this.scrollDistance;

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.wrapper,
      start: 'top top',
      end: () => `+=${distance}`,
      pin: this.viewport,
      pinSpacing: true,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        this.onScrollProgress(self.progress);
      }
    });

    // Render initial progress 0
    this.onScrollProgress(0);
  }

  onScrollProgress(progress) {
    // 1. Frame Scrubbing
    const frameIndex = Math.min(
      this.totalFrames,
      Math.max(1, Math.floor(progress * (this.totalFrames - 1)) + 1)
    );

    if (frameIndex !== this.lastRenderedIndex) {
      this.lastRenderedIndex = frameIndex;
      const img = this.frameLoader.getFrame(frameIndex);
      if (img) {
        this.canvasRenderer.renderFrame(img);
      }
    }

    // 2. Progress Bar
    if (this.progressBar) {
      this.progressBar.style.width = `${(progress * 100).toFixed(2)}%`;
    }

    // 3. Text Stage Transitions
    this.updateTextStages(progress);

    // 4. Steam Transition
    if (this.steamTransition) {
      this.steamTransition.update(progress, 0.84, 0.95, 1.0);
    }
  }

  updateTextStages(progress) {
    this.stageElements.forEach((stage) => {
      if (!stage.el) return;

      const { start, active, end } = stage;
      
      if (progress < start || progress > end) {
        // Outside active range
        stage.el.style.opacity = '0';
        stage.el.style.visibility = 'hidden';
        stage.el.style.pointerEvents = 'none';
        stage.el.style.transform = progress < start 
          ? 'translateY(24px) scale(0.98)' 
          : 'translateY(-24px) scale(1.02)';
        stage.el.classList.remove('is-active');
        return;
      }

      // Inside stage range: compute smooth interpolation
      let opacity = 1;
      let translateY = 0;
      let scale = 1;

      const enterDuration = Math.max(0.01, active - start);
      const exitDuration = Math.max(0.01, end - (active + 0.05));

      const isOpeningStage = stage.id === 'phase-1' || start === 0;

      if (isOpeningStage) {
        if (progress <= active) {
          // Opening stage: immediately active and visible on website open without requiring scroll
          opacity = 1;
          translateY = 0;
          scale = 1;
        } else if (exitDuration > 0) {
          // Smooth exit as user scrolls deeper into the journey
          const t = (progress - active) / exitDuration;
          const clampedT = Math.min(1, Math.max(0, t));
          const easeT = clampedT * clampedT * (3 - 2 * clampedT);
          opacity = 1 - easeT;
          translateY = -24 * easeT;
          scale = 1 + 0.02 * easeT;
        }
      } else if (progress < active) {
        // Entering
        const t = (progress - start) / enterDuration;
        const easeT = t * t * (3 - 2 * t); // smoothstep
        opacity = easeT;
        translateY = 24 * (1 - easeT);
        scale = 0.98 + 0.02 * easeT;
      } else if (progress > (active + 0.05) && exitDuration > 0) {
        // Exiting
        const t = (progress - (active + 0.05)) / exitDuration;
        const clampedT = Math.min(1, Math.max(0, t));
        const easeT = clampedT * clampedT * (3 - 2 * clampedT);
        opacity = 1 - easeT;
        translateY = -24 * easeT;
        scale = 1 + 0.02 * easeT;
      } else {
        // Stable peak
        opacity = 1;
        translateY = 0;
        scale = 1;
      }

      stage.el.style.visibility = 'visible';
      stage.el.style.opacity = opacity.toFixed(3);
      stage.el.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      
      if (opacity > 0.4) {
        stage.el.style.pointerEvents = 'auto';
        stage.el.classList.add('is-active');
      } else {
        stage.el.style.pointerEvents = 'none';
        stage.el.classList.remove('is-active');
      }
    });
  }

  updateConfig({ stages, totalFrames, scrollDistance }) {
    this.stages = stages;
    this.totalFrames = totalFrames;
    this.scrollDistance = scrollDistance;
    this.lastRenderedIndex = -1;

    this.stageElements = this.stages.map((stage) => {
      const el = document.getElementById(`stage-${stage.id.replace('phase-', '')}`);
      return {
        ...stage,
        el
      };
    });

    this.setupScrollTrigger();
  }

  refresh() {
    if (this.scrollTrigger) {
      this.scrollTrigger.refresh();
    }
  }

  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }
  }
}
