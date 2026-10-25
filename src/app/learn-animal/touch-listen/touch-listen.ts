import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export type AnimalType = 'chicken' | 'fish' | 'dog' | null;

@Component({
  selector: 'app-touch-listen',
  imports: [CommonModule],
  templateUrl: './touch-listen.html',
  styleUrl: './touch-listen.scss',
})
export class TouchListen implements OnInit, OnDestroy {
  // Quản lý đường dẫn ảnh cho từng con vật
  animalImages = {
    dog: {
      static: '/images/dog.png',
      animated: '/images/dog-animated.gif',
      current: '/images/dog.png'
    },
    chicken: {
      static: '/images/chicken.png',
      animated: '/images/chicken-animated.gif',
      current: '/images/chicken.png'
    },
    fish: {
      static: '/images/fish.png',
      animated: '/images/fish-animated.gif',
      current: '/images/fish.png'
    }
  };

  activeAnimal = signal<AnimalType>(null);
  message = signal<string>('Bé hãy chạm vào một bạn động vật nhé!');

  // Biến quản lý âm thanh intro khi vừa vào màn hình
  private introAudio: HTMLAudioElement | null = null;
  // Biến quản lý âm thanh tương tác của con vật (nếu cần)
  private interactionAudio: HTMLAudioElement | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    // Tự động phát âm thanh MP3 ngay khi vừa vào màn hình
    this.playIntroAudio();
  }

  ngOnDestroy() {
    // Dọn dẹp âm thanh nếu người dùng thoát khỏi trang này
    this.stopAllAudio();
  }

  private playIntroAudio() {
    try {
      // Thay đổi đường dẫn đến file mp3 giới thiệu màn hình của bạn
      this.introAudio = new Audio('/sounds/part_3.m4a');
      this.introAudio.play().catch(error => {
        console.log("Trình duyệt chặn tự động phát âm thanh:", error);
      });
    } catch (e) {
      console.error("Lỗi khởi tạo file audio intro:", e);
    }
  }

  interactWithAnimal(animal: AnimalType) {
    if (!animal) return;

    this.activeAnimal.set(animal);

    // Chuyển nguồn ảnh sang GIF động
    this.animalImages[animal].current = this.animalImages[animal].animated;

    if (animal === 'chicken') {
      this.message.set('🐔 Gà mẹ cục tác: Cục... tác... cục... tác!');
    } else if (animal === 'fish') {
      this.message.set('🐟 Cá nhỏ bơi lội: Bơi bơi bơi, úp lặn nào!');
    } else if (animal === 'dog') {
      this.message.set('🐶 Cún con mừng quýnh: Gâu gâu! (Vẫy đuôi mừng bé)');
    }

    // Sau 5 giây, đổi lại ảnh tĩnh và reset trạng thái
    setTimeout(() => {
      this.animalImages[animal].current = this.animalImages[animal].static;
      this.activeAnimal.set(null);
    }, 5000);
  }

  backToHome() {
    this.stopAllAudio();
    this.router.navigate(['/']);
  }

  private stopAllAudio() {
    if (this.introAudio) {
      this.introAudio.pause();
      this.introAudio = null;
    }
    if (this.interactionAudio) {
      this.interactionAudio.pause();
      this.interactionAudio = null;
    }
  }
}