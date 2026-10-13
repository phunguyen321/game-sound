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
  // Inject Router theo chuẩn Angular hiện đại (dùng inject function)
  private router = inject(Router);
  // Trạng thái màn hình
  screenState = signal<'welcome' | 'playing' | 'menu'>('welcome');

  // Game đang được chọn
  selectedGame = signal<GameType | null>(null);

  // Lấy thẻ video từ HTML
  introVideo = viewChild<ElementRef<HTMLVideoElement>>('introVideo');

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
    this.screenState.set('menu');
  }

  skipVideo() {
    const videoEl = this.introVideo()?.nativeElement;
    if (videoEl) {
      videoEl.pause();
    }
    this.screenState.set('menu');
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
