import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-play-sound',
  standalone: true,
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

  // swipe
  startX = 0;
  currentX = 0;

  // UI
  isTouching = false;

  tapThreshold = 10;

  ngOnInit() {
    this.animals.forEach(a => {
      const audio = new Audio(a.sound);

      audio.onended = () => {
        if (this.currentPlaying === a.id) {
          this.currentPlaying = null;
        }
      };

      this.audios[a.id] = audio;
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

    if (this.currentPlaying === id) {
      if (!audio.paused) {
        audio.pause();
      } else {
        audio.play();
      }
      return;
    }


    if (this.currentPlaying) {
      const currentAudio = this.audios[this.currentPlaying];
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }


    audio.currentTime = 0;
    audio.play();
    this.currentPlaying = id;
  }


  handleTap() {
    this.isTouching = true;

    this.playSound(this.currentAnimal.id);

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    setTimeout(() => {
      this.isTouching = false;
    }, 150);
  }


  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent) {
    const moveX = event.touches[0].clientX;
    this.currentX = moveX - this.startX;
  }

  onTouchEnd() {
    const moved = Math.abs(this.currentX);

    // TAP
    if (moved < this.tapThreshold) {
      this.handleTap();
    }
    // SWIPE
    else {
      const threshold = 80;

      if (this.currentX > threshold) {
        this.prev();
      } else if (this.currentX < -threshold) {
        this.next();
      }
    }

    this.currentX = 0;
  }

  next() {
    this.stopCurrentAudio();
    this.currentIndex = (this.currentIndex + 1) % this.animals.length;
  }

  prev() {
    this.stopCurrentAudio();
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