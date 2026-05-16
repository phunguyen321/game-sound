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

  // 📚 LESSON (cố định theo page)
  lessons = [
    { correct: { id: 'yellow', label: 'Vàng', hex: '#ffd633', sound: '/sounds/ting.mp3' } },
    { correct: { id: 'blue', label: 'Xanh dương', hex: '#4d79ff', sound: '/sounds/ting.mp3' } },
    { correct: { id: 'red', label: 'Đỏ', hex: '#ff4d4d', sound: '/sounds/ting.mp3' } },
  ];

  wrongPool: ColorItem[] = [
    { id: 'green', label: 'Xanh lá', hex: '#3ddc84', sound: '/sounds/wrong.mp3' },
    { id: 'pink', label: 'Hồng', hex: '#ff6bcb', sound: '/sounds/wrong.mp3' },
    { id: 'purple', label: 'Tím', hex: '#a855f7', sound: '/sounds/wrong.mp3' },
  ];

  index = signal(0);

  leftColor = signal<ColorItem>(this.randomWrong());
  rightColor = signal<ColorItem>(this.randomWrong());

  correctSide = signal<Side>('left');

  selectedSide = signal<Side | null>(null);

  private startX = 0;
  private dragX = signal(0);

  constructor() {
    this.loadLesson();
  }

  // =====================
  // LOAD PAGE (CHỈ SWIPE MỚI GỌI)
  // =====================
  private loadLesson() {

    const lesson = this.lessons[this.index()];

    const correct = lesson.correct;

    let wrong = this.randomWrong();
    while (wrong.id === correct.id) {
      wrong = this.randomWrong();
    }

    const isLeft = Math.random() > 0.5;

    this.leftColor.set(isLeft ? correct : wrong);
    this.rightColor.set(isLeft ? wrong : correct);

    this.correctSide.set(isLeft ? 'left' : 'right');

    this.selectedSide.set(null);
  }

  private randomWrong(): ColorItem {
    return this.wrongPool[
      Math.floor(Math.random() * this.wrongPool.length)
    ];
  }

  // =====================
  // 👆 TAP (KHÔNG ĐỔI MÀU)
  // =====================
  pickColor(side: Side) {

    this.selectedSide.set(side);

    const isCorrect = side === this.correctSide();

    const selected =
      side === 'left' ? this.leftColor() : this.rightColor();

    new Audio(selected.sound).play().catch(() => { });

    if (isCorrect) {
      new Audio('/sounds/ting.mp3').play().catch(() => { });
    } else {
      new Audio('/sounds/wrong.mp3').play().catch(() => { });
    }

    // ❌ KHÔNG gọi loadLesson ở đây
    setTimeout(() => {
      this.selectedSide.set(null);
    }, 250);
  }

  // =====================
  // 🔁 SWIPE = ĐỔI PAGE
  // =====================
  nextPage() {
    this.index.update(i => (i + 1) % this.lessons.length);
    this.loadLesson();
  }

  onTouchStart(e: TouchEvent) {
    this.startX = e.touches[0].clientX;
  }

  onTouchMove(e: TouchEvent) {
    this.dragX.set(e.touches[0].clientX - this.startX);
  }

  onTouchEnd() {
    if (Math.abs(this.dragX()) > 80) {
      this.nextPage(); // ✅ ONLY HERE CHANGE COLOR
    }
    this.dragX.set(0);
  }

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