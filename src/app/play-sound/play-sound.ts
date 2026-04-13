import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Animal {
  id: string;
  name: string;
  image: string;
  sound: string;
}

@Component({
  selector: 'app-play-sound',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play-sound.html',
  styleUrl: './play-sound.scss',
})
export class PlaySound {
  private destroyRef = inject(DestroyRef);

  readonly animals: Animal[] = [
    { id: 'duck', name: 'Vịt', image: '/images/duck.png', sound: '/sounds/duck.mp3' },
    { id: 'chicken', name: 'Gà', image: '/images/chicken.png', sound: '/sounds/chicken.mp3' },
    { id: 'bird', name: 'Chim', image: '/images/bird.png', sound: '/sounds/bird.mp3' },
  ];

  // --- State --- 
  currentIndex = signal(0);
  audioState = signal<'idle' | 'playing' | 'paused'>('idle');
  isTouching = signal(false);

  // --- Computed --- 
  currentAnimal = computed(() => this.animals[this.currentIndex()]);
  transformStyle = computed(() => `translateX(${this.dragX()}px)`);

  // --- Swipe tracking --- 
  private startX = 0;
  private dragX = signal(0);

  private readonly TAP_THRESHOLD = 10;
  private readonly SWIPE_THRESHOLD = 80;

  // --- Audio --- 
  private audios = new Map<string, HTMLAudioElement>();
  private playingId: string | null = null;

  constructor() {
    this.initAudios();
    this.destroyRef.onDestroy(() => this.disposeAudios());
  }

  // --- Pointer tracking --- 
  private isDragging = false;
  private lastTouchTime = 0;

  // Touch 
  onTouchStart(e: TouchEvent) {
    this.lastTouchTime = Date.now();
    this.pointerStart(e.touches[0].clientX);
  }

  onTouchMove(e: TouchEvent) {
    this.pointerMove(e.touches[0].clientX);
  }

  onTouchEnd() {
    this.pointerEnd();
  }

  private isFromTouch() {
    return Date.now() - this.lastTouchTime < 500;
  }

  // Mouse 
  onMouseDown(e: MouseEvent) {
    if (this.isFromTouch()) return;
    this.isDragging = true;
    this.pointerStart(e.clientX);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    this.pointerMove(e.clientX);
  }

  onMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.pointerEnd();
  }

  onMouseLeave() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.dragX.set(0);
  }

  // Unified 
  private pointerStart(x: number) {
    this.startX = x;
  }

  private pointerMove(x: number) {
    this.dragX.set(x - this.startX);
  }

  private pointerEnd() {
    Math.abs(this.dragX()) < this.TAP_THRESHOLD
      ? this.tap()
      : this.swipe();

    this.dragX.set(0);
  }

  // --- Private --- 

  private tap() {
    this.isTouching.set(true);
    this.toggleSound(this.currentAnimal().id);
    navigator.vibrate?.(30);
    setTimeout(() => this.isTouching.set(false), 150);
  }

  private swipe() {
    const dx = this.dragX();
    if (dx > this.SWIPE_THRESHOLD) this.go(-1);
    else if (dx < -this.SWIPE_THRESHOLD) this.go(1);
  }

  private go(dir: 1 | -1) {
    this.stopSound();
    this.currentIndex.update(i =>
      (i + dir + this.animals.length) % this.animals.length,
    );
  }

  private toggleSound(id: string) {
    const audio = this.audios.get(id);
    if (!audio) return;

    if (this.playingId === id) {
      if (audio.paused) {
        audio.play();
        this.audioState.set('playing');
      } else {
        audio.pause();
        this.audioState.set('paused');
      }
      return;
    }

    this.stopSound();
    audio.currentTime = 0;
    audio.play();
    this.playingId = id;
    this.audioState.set('playing');
  }

  private stopSound() {
    if (!this.playingId) return;

    const audio = this.audios.get(this.playingId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.playingId = null;
    this.audioState.set('idle');
  }

  private initAudios() {
    for (const animal of this.animals) {
      const audio = new Audio(animal.sound);
      audio.addEventListener('ended', () => {
        if (this.playingId === animal.id) {
          this.playingId = null;
          this.audioState.set('idle');
        }
      });
      this.audios.set(animal.id, audio);
    }
  }

  private disposeAudios() {
    for (const audio of this.audios.values()) {
      audio.pause();
      audio.src = '';
    }
    this.audios.clear();
  }
}