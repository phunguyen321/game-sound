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
      current: '/images/dog.png',
      audio: '/sounds/dog_music.mp3' // Đường dẫn file MP3 của chó
    },
    chicken: {
      static: '/images/chicken.png',
      animated: '/images/chicken-animated.gif',
      current: '/images/chicken.png',
      audio: '/sounds/chicken_music.mp3' // Đường dẫn file MP3 của gà
    },
    fish: {
      static: '/images/fish.png',
      animated: '/images/fish-animated.gif',
      current: '/images/fish.png',
      audio: '/sounds/fish_music.mp3' // Đường dẫn file MP3 của cá
    }
  };
  activeAnimal = signal<AnimalType>(null);
  message = signal<string>('Bé hãy chạm vào một bạn động vật nhé!');

  private currentAudio: HTMLAudioElement | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    // Tự động phát âm thanh MP3 intro khi vừa vào màn hình
    this.playAudio('/sounds/part_3.m4a', null);
  }

  ngOnDestroy() {
    this.stopAudio();
  }

  // Hàm phát âm thanh chung, nhận thêm tham số animal để biết khi nào âm thanh kết thúc
  private playAudio(audioPath: string, targetAnimal: AnimalType) {
    this.stopAudio();

    try {
      this.currentAudio = new Audio(audioPath);

      // Lắng nghe sự kiện âm thanh phát xong tự động tắt
      this.currentAudio.onended = () => {
        if (targetAnimal && this.activeAnimal() === targetAnimal) {
          this.resetAnimalState(targetAnimal);
        }
        this.currentAudio = null;
      };

      this.currentAudio.play().catch(error => {
        console.log("Trình duyệt chặn tự động phát âm thanh:", error);
      });
    } catch (e) {
      console.error("Lỗi phát audio:", e);
    }
  }

  // Hàm ngắt âm thanh hiện tại
  private stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.onended = null; // Gỡ bỏ sự kiện cũ
      this.currentAudio = null;
    }
  }

  // Đưa con vật về trạng thái tĩnh ban đầu
  private resetAnimalState(animal: AnimalType) {
    if (!animal) return;
    this.animalImages[animal].current = this.animalImages[animal].static;
    if (this.activeAnimal() === animal) {
      this.activeAnimal.set(null);
      this.message.set('Bé hãy chạm vào một bạn động vật nhé!');
    }
  }

  interactWithAnimal(animal: AnimalType) {
    if (!animal) return;

    // 1. Nếu đang phát và bấm lại vào chính nó -> Dừng phát, trả về tĩnh ngay lập tức
    if (this.activeAnimal() === animal) {
      this.stopAudio();
      this.resetAnimalState(animal);
      return;
    }

    // 2. Nếu đang chọn con vật khác (hoặc đang phát intro) -> Ngắt âm thanh cũ
    this.stopAudio();

    // Reset toàn bộ hình ảnh các con vật khác về trạng thái tĩnh trước đó
    Object.keys(this.animalImages).forEach(key => {
      const k = key as keyof typeof this.animalImages;
      this.animalImages[k].current = this.animalImages[k].static;
    });

    // Kích hoạt trạng thái mới cho con vật được chọn
    this.activeAnimal.set(animal);
    this.animalImages[animal].current = this.animalImages[animal].animated;

    if (animal === 'chicken') {
      this.message.set('🐔 Gà mẹ cục tác: Cục... tác... cục... tác!');
    } else if (animal === 'fish') {
      this.message.set('🐟 Cá nhỏ bơi lội: Bơi bơi bơi, úp lặn nào!');
    } else if (animal === 'dog') {
      this.message.set('🐶 Cún con mừng quýnh: Gâu gâu! (Vẫy đuôi mừng bé)');
    }

    // Phát âm thanh của con vật và truyền vào targetAnimal để quản lý vòng đời GIF
    const soundPath = this.animalImages[animal].audio;
    this.playAudio(soundPath, animal);
  }

  backToHome() {
    this.stopAudio();
    this.router.navigate(['/']);
  }
}