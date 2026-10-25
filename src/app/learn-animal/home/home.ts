import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

export type GameType = 'find-animal' | 'listen-speak' | 'touch-listen';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private router = inject(Router);

  // Trạng thái màn hình (mặc định ban đầu có thể là welcome)
  screenState = signal<'welcome' | 'playing' | 'menu'>('welcome');

  selectedGame = signal<GameType | null>(null);
  introVideo = viewChild<ElementRef<HTMLVideoElement>>('introVideo');

  ngOnInit() {
    // Kiểm tra trong sessionStorage xem phiên làm việc này đã xem intro chưa
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

    if (hasSeenIntro === 'true') {
      // Nếu đã xem rồi trong tab này -> Vào thẳng menu luôn
      this.screenState.set('menu');
    } else {
      // Nếu chưa xem -> Giữ nguyên trạng thái 'welcome' ban đầu
      this.screenState.set('welcome');
    }
  }

  startExperience() {
    this.screenState.set('playing');

    setTimeout(() => {
      const videoEl = this.introVideo()?.nativeElement;
      if (videoEl) {
        videoEl.muted = false;
        videoEl.play().catch(error => {
          console.log("Trình duyệt chặn autoplay, tự động phát muted:", error);
          videoEl.muted = true;
          videoEl.play();
        });
      }
    }, 50);
  }

  onVideoEnded() {
    this.markIntroAsWatched();
    this.screenState.set('menu');
  }

  skipVideo() {
    const videoEl = this.introVideo()?.nativeElement;
    if (videoEl) {
      videoEl.pause();
    }
    this.markIntroAsWatched();
    this.screenState.set('menu');
  }

  // Đánh dấu đã xem intro vào sessionStorage của tab trình duyệt hiện tại
  private markIntroAsWatched() {
    sessionStorage.setItem('hasSeenIntro', 'true');
  }

  selectGame(game: GameType) {
    switch (game) {
      case 'find-animal':
        this.router.navigate(['/find-animal']);
        break;
      case 'listen-speak':
        this.router.navigate(['/listen-speak']);
        break;
      case 'touch-listen':
        this.router.navigate(['/touch-listen']);
        break;
    }
  }
}
