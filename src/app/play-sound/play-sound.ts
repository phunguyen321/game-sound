import { Component, OnInit } from '@angular/core';
import { Animal } from '../model/animal.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-play-sound',
  imports: [CommonModule],
  templateUrl: './play-sound.html',
  styleUrl: './play-sound.scss',
})
export class PlaySound implements OnInit {

  animals = [
    { id: 'duck', name: 'Vịt', image: '/images/duck.png', sound: '/sounds/duck.mp3' },
    { id: 'chicken', name: 'Gà', image: '/images/chicken.png', sound: '/sounds/chicken.mp3' },
    { id: 'bird', name: 'Chim', image: '/images/bird.png', sound: '/sounds/bird.mp3' }
  ];

  audios: Record<string, HTMLAudioElement> = {};
  currentPlaying: string | null = null;

  currentIndex = 0;

  // 👇 swipe state
  startX = 0;
  currentX = 0;
  isDragging = false;

  isTouching = false;

  ngOnInit() {
    this.animals.forEach(a => {
      this.audios[a.id] = new Audio(a.sound);
    });
  }

  get currentAnimal() {
    return this.animals[this.currentIndex];
  }

  get transformStyle() {
    return `translateX(${this.currentX}px)`;
  }

  playSound(id: string) {
    const audio = this.audios[id];
    if (!audio) return;

    if (this.currentPlaying && this.currentPlaying !== id) {
      this.audios[this.currentPlaying].pause();
    }

    audio.currentTime = 0;
    audio.play();
    this.currentPlaying = id;
  }

  // 👆 TAP
  onTap() {
    if (this.isDragging) return; // tránh conflict

    this.isTouching = true;
    this.playSound(this.currentAnimal.id);

    setTimeout(() => {
      this.isTouching = false;
    }, 200);
  }

  // 👉 SWIPE REALTIME
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.isDragging = true;
  }

  onTouchMove(event: TouchEvent) {
    const moveX = event.touches[0].clientX;
    this.currentX = moveX - this.startX;
  }

  onTouchEnd() {
    this.isDragging = false;

    const threshold = 80;

    if (this.currentX > threshold) {
      this.prev();
    } else if (this.currentX < -threshold) {
      this.next();
    }

    // reset về giữa
    this.currentX = 0;
  }

  next() {
    this.stopCurrentAudio()
    this.currentIndex = (this.currentIndex + 1) % this.animals.length;
  }

  prev() {
    this.stopCurrentAudio()
    this.currentIndex =
      (this.currentIndex - 1 + this.animals.length) % this.animals.length;
  }

  stopCurrentAudio() {
    if (this.currentPlaying) {
      const audio = this.audios[this.currentPlaying];
      audio.pause();
      audio.currentTime = 0;
      this.currentPlaying = null;
    }
  }
}