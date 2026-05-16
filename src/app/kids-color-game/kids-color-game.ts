import { Component, computed, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ColorItem {
  id: string;
  label: string;
  hex: string;
  sound: string;
}

@Component({
  selector: 'app-kids-color-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kids-color-game.html',
  styleUrl: './kids-color-game.scss',
})
export class KidsColorGame {

  private destroyRef = inject(DestroyRef);

  readonly colors: ColorItem[] = [
    { id: 'red', label: '', hex: '#ff4d4d', sound: '/sounds/colors/red.mp3' },
    { id: 'blue', label: '', hex: '#4d79ff', sound: '/sounds/colors/blue.mp3' },
    { id: 'yellow', label: '', hex: '#ffd633', sound: '/sounds/colors/yellow.mp3' },
  ];

  // STATE
  currentIndex = signal(0);
  isTouching = signal(false);

  currentColor = computed(() => this.colors[this.currentIndex()]);

  // swipe
  private startX = 0;
  private dragX = signal(0);

  transformStyle = computed(() => {
    return `translateX(${this.dragX()}px)`;
  });

  private readonly TAP_THRESHOLD = 10;
  private readonly SWIPE_THRESHOLD = 80;

  // audio pool
  private audios = new Map<string, HTMLAudioElement>();
  private playingId: string | null = null;

  constructor() {
    this.initAudios();
    this.destroyRef.onDestroy(() => this.disposeAudios());
  }

  // TOUCH
  onTouchStart(e: TouchEvent) {
    this.pointerStart(e.touches[0].clientX);
  }

  onTouchMove(e: TouchEvent) {
    this.pointerMove(e.touches[0].clientX);
  }

  onTouchEnd() {
    this.pointerEnd();
  }

  // MOUSE
  onMouseDown(e: MouseEvent) {
    this.pointerStart(e.clientX);
  }

  onMouseMove(e: MouseEvent) {
    this.pointerMove(e.clientX);
  }

  onMouseUp() {
    this.pointerEnd();
  }

  onMouseLeave() {
    this.dragX.set(0);
  }

  // CORE
  private pointerStart(x: number) {
    this.startX = x;
  }

  private pointerMove(x: number) {
    this.dragX.set(x - this.startX);
  }

  private pointerEnd() {

    const dx = this.dragX();

    if (Math.abs(dx) < this.TAP_THRESHOLD) {
      this.tap();
    } else {
      this.swipe(dx);
    }

    this.dragX.set(0);
  }

  private tap() {
    this.isTouching.set(true);

    const color = this.currentColor();

    this.playSound(color.id);

    navigator.vibrate?.(30);

    setTimeout(() => this.isTouching.set(false), 150);
  }

  private swipe(dx: number) {
    if (dx > this.SWIPE_THRESHOLD) {
      this.go(-1);
    } else if (dx < -this.SWIPE_THRESHOLD) {
      this.go(1);
    }
  }

  private go(dir: 1 | -1) {
    this.stopSound();

    this.currentIndex.update(i =>
      (i + dir + this.colors.length) % this.colors.length
    );
  }

  // AUDIO
  private initAudios() {
    for (const c of this.colors) {
      const audio = new Audio(c.sound);
      this.audios.set(c.id, audio);
    }
  }

  private playSound(id: string) {
    const audio = this.audios.get(id);
    if (!audio) return;

    this.stopSound();

    audio.currentTime = 0;
    audio.play();

    this.playingId = id;
  }

  private stopSound() {
    if (!this.playingId) return;

    const audio = this.audios.get(this.playingId);
    audio?.pause();
    if (audio) audio.currentTime = 0;

    this.playingId = null;
  }

  private disposeAudios() {
    for (const audio of this.audios.values()) {
      audio.pause();
      audio.src = '';
    }
    this.audios.clear();
  }
}