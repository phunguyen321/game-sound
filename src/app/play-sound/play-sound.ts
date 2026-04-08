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
    { id: 'duck', name: 'Vịt', image: '/images/duck.png', sound: '/sounds/duck.mp3' },
    { id: 'chicken', name: 'Gà', image: '/images/chicken.png', sound: '/sounds/chicken.mp3' },
    { id: 'bird', name: 'Chim', image: '/images/bird.png', sound: '/sounds/bird.mp3' }
  ];

  audios: Record<string, HTMLAudioElement> = {};
  currentPlaying: string | null = null;

  ngOnInit(): void {
    this.animals.forEach(a => {
      this.audios[a.id] = new Audio(a.sound);
    });
  }


  playSound(id: string) {
    const audio = this.audios[id];
    if (!audio) return;

    // pause audio đang phát
    if (this.currentPlaying && this.currentPlaying !== id) {
      this.audios[this.currentPlaying].pause();
    }

    // reset + play
    audio.currentTime = 0;
    audio.play();

    this.currentPlaying = id;
  }
}
