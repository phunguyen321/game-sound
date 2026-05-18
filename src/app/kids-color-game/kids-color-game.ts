import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ColorItem {
  id: string;
  label: string;
  hex: string;
  sound: string;
}

type Side = 'left' | 'right';

@Component({
  selector: 'app-kids-color-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kids-color-game.html',
  styleUrl: './kids-color-game.scss',
})
export class KidsColorGame {

  // =====================
  // 🎨 COLORS
  // =====================

  blue: ColorItem = {
    id: 'blue',
    label: 'Xanh dương',
    hex: '#4d79ff',
    sound: '/sounds/color/color-blue.mp3'
  };

  yellow: ColorItem = {
    id: 'yellow',
    label: 'Vàng',
    hex: '#ffd633',
    sound: '/sounds/color/color-yellow.mp3'
  };

  red: ColorItem = {
    id: 'red',
    label: 'Đỏ',
    hex: '#ff4d4d',
    sound: '/sounds/color/color-red.mp3'
  };

  // =====================
  // 📚 3 PAGES CỐ ĐỊNH
  // =====================

  lessons = [

    {
      correct: this.yellow,
      wrong: this.blue
    },

    {
      correct: this.red,
      wrong: this.yellow
    },

    {
      correct: this.blue,
      wrong: this.red
    }

  ];

  index = signal(0);

  leftColor = signal<ColorItem>(this.blue);
  rightColor = signal<ColorItem>(this.yellow);

  correctSide = signal<Side>('right');

  selectedSide = signal<Side | null>(null);

  private startX = 0;
  private dragX = signal(0);

  constructor() {
    this.loadLesson();
  }

  // =====================
  // LOAD PAGE
  // =====================

  private loadLesson() {

    const lesson = this.lessons[this.index()];

    const sides: Side[] = ['left', 'right'];

    // random thật
    const randomSide =
      sides[Math.floor(Math.random() * sides.length)];

    this.correctSide.set(randomSide);

    if (randomSide === 'left') {

      this.leftColor.set(lesson.correct);
      this.rightColor.set(lesson.wrong);

    } else {

      this.leftColor.set(lesson.wrong);
      this.rightColor.set(lesson.correct);
    }

    this.selectedSide.set(null);
  }
  // =====================
  // 👆 TAP COLOR
  // =====================

  pickColor(side: Side) {

    this.selectedSide.set(side);

    const isCorrect = side === this.correctSide();

    const selected =
      side === 'left'
        ? this.leftColor()
        : this.rightColor();

    // ✅ ĐÚNG -> đọc tên màu
    if (isCorrect) {

      new Audio(selected.sound).play().catch(() => { });

    } else {

      // ❌ SAI -> chỉ phát wrong
      new Audio('/sounds/wrong.mp3').play().catch(() => { });

    }

    setTimeout(() => {
      this.selectedSide.set(null);
    }, 250);
  }

  // =====================
  // 🔁 NEXT PAGE
  // =====================

  nextPage() {
    this.index.update(i => (i + 1) % this.lessons.length);
    this.loadLesson();
  }

  // =====================
  // 📱 TOUCH
  // =====================

  onTouchStart(e: TouchEvent) {
    this.startX = e.touches[0].clientX;
  }

  onTouchMove(e: TouchEvent) {
    this.dragX.set(e.touches[0].clientX - this.startX);
  }

  onTouchEnd() {

    if (Math.abs(this.dragX()) > 80) {
      this.nextPage();
    }

    this.dragX.set(0);
  }

  // =====================
  // 🖱️ MOUSE
  // =====================

  onMouseDown(e: MouseEvent) {
    this.startX = e.clientX;
  }

  onMouseMove(e: MouseEvent) {
    this.dragX.set(e.clientX - this.startX);
  }

  onMouseUp() {
    this.onTouchEnd();
  }

  onMouseLeave() {
    this.dragX.set(0);
  }
}