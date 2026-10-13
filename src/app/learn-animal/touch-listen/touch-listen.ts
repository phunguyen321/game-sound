import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

export type AnimalType = 'chicken' | 'fish' | 'dog' | null;

@Component({
  selector: 'app-touch-listen',
  imports: [],
  templateUrl: './touch-listen.html',
  styleUrl: './touch-listen.scss',
})
export class TouchListen {
  // Quản lý đường dẫn ảnh cho từng con vật
  // Cấu trúc: [ảnh tĩnh lúc đứng yên, ảnh GIF lúc đang chạy]
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

  constructor(private router: Router) { }

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

    // Sau 2 giây (đúng thời lượng GIF chạy hoặc cảm giác tương tác), đổi lại ảnh tĩnh
    setTimeout(() => {
      this.animalImages[animal].current = this.animalImages[animal].static;
      this.activeAnimal.set(null);
    }, 5000);
  }

  backToHome() {
    this.router.navigate(['/']);
  }
}
