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
  animals: Animal[] = [
    { id: 'duck', name: 'Vịt', image: '/images/duck.jpg', sound: '/sounds/duck.mp3' },
    // { id: 'chicken', name: 'Gà', image: '/images/chicken.png', sound: '/sounds/chicken.mp3' },
    // { id: 'dog', name: 'Chó', image: '/images/dog.png', sound: '/sounds/dog.mp3' }
  ];

  // Lưu trữ instance của âm thanh đang phát để có thể dừng lại nếu bé bấm liên tục
  currentAudio: HTMLAudioElement | null = null;
  audios: Record<string, HTMLAudioElement> = {};

  ngOnInit(): void {
    this.animals.forEach(a => {
      this.audios[a.name] = new Audio(a.sound);
    });
  }
  playSound(soundPath: string) {
    const audio = this.audios[soundPath];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }
}
