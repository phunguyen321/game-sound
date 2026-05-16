import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import confetti from 'canvas-confetti';

interface Sparkle {
  x: number;
  y: number;
  delay: number;
}

interface FlyingStar {
  left: number;
  top: number;
  duration: number;
  delay: number;
  icon: string;
}

@Component({
  selector: 'app-kids-star-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kids-star-game.html',
  styleUrls: ['./kids-star-game.scss'],
})
export class KidsStarGame implements OnInit {

  sparkles: Sparkle[] = [];

  flyingStars: FlyingStar[] = [];

  private audio!: HTMLAudioElement;

  ngOnInit(): void {

    // preload sound
    this.audio = new Audio();

    this.audio.src = '/sounds/star/yeah.mp3';

    this.audio.load();

    // generate floating stars
    this.generateFlyingStars();
  }

  explodeStar(event: MouseEvent, starElement: HTMLElement) {

    // vị trí chạm
    const x = event.clientX;
    const y = event.clientY;

    // move ngôi sao lớn tới điểm chạm
    starElement.style.left = `${x}px`;
    starElement.style.top = `${y}px`;

    // reset animation
    starElement.classList.remove('animate');
    void starElement.offsetWidth;
    starElement.classList.add('animate');

    // lấy tâm THẬT của ngôi sao sau khi đã move
    const rect = starElement.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // sound
    this.audio.currentTime = 0;
    this.audio.play().catch(console.error);

    // sparkle bung từ tâm ngôi sao lớn
    this.createSparkles(centerX, centerY);

    // confetti cũng bung từ tâm ngôi sao
    const originX = centerX / window.innerWidth;
    const originY = centerY / window.innerHeight;

    // STAR EXPLOSION
    confetti({
      particleCount: 150,

      spread: 360,

      startVelocity: 35,

      gravity: 0.6,

      scalar: 1.4,

      ticks: 220,

      origin: {
        x: originX,
        y: originY
      },

      shapes: ['star'],

      colors: [
        '#FFD700',
        '#FFF176',
        '#FFEB3B',
        '#FFFFFF',
        '#FFC107'
      ]
    });

  }

  createSparkles(x: number, y: number) {

    this.sparkles = [];

    for (let i = 0; i < 40; i++) {

      const sparkle = {
        x,
        y,
        delay: Math.random() * 300
      };

      this.sparkles.push(sparkle);

      setTimeout(() => {

        const elements = document.querySelectorAll('.sparkle');

        const el = elements[i] as HTMLElement;

        if (el) {

          el.style.setProperty('--x', Math.random().toString());

          el.style.setProperty('--y', Math.random().toString());
        }

      });
    }
  }

  generateFlyingStars() {

    const icons = ['⭐', '🌟', '✨'];

    for (let i = 0; i < 20; i++) {

      this.flyingStars.push({

        left: Math.random() * 100,

        top: Math.random() * 100,

        duration: 2 + Math.random() * 4,

        delay: Math.random() * 3,

        icon: icons[
          Math.floor(Math.random() * icons.length)
        ]
      });
    }
  }
}