import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface HabitatItem {
  id: string;
  name: string;
  image: string;
  audio: string;    // Đường dẫn file MP3 của con vật
  soundText: string;
}

interface Habitat {
  id: string;
  name: string;
  image: string;
  introAudio: string; // Đường dẫn file MP3 intro riêng của khu vực
  hint: string;
  items: HabitatItem[];
}

@Component({
  selector: 'app-find-animal',
  imports: [CommonModule], // Đảm bảo đã có CommonModule để chạy @if, @for
  templateUrl: './find-animal.html',
  styleUrl: './find-animal.scss',
})
export class FindAnimal {
  selectedHabitatId = signal<string | null>(null);
  currentActiveHabitat: Habitat | null = null;

  // Biến lưu trữ đối tượng âm thanh đang phát (intro hoặc âm thanh con vật)
  private currentAudio: HTMLAudioElement | null = null;

  router = inject(Router);

  readonly HABITATS_DATA: Habitat[] = [
    {
      id: 'lake',
      name: 'Cái Hồ Xanh Mát',
      image: '/images/ao_ca_remove.png',
      introAudio: '/sounds/fish_part_1.m4a', // 🔊 File âm thanh intro của Hồ Xanh Mát
      hint: 'Bấm vào từng con cá bơi lội để phát ra âm thanh đúng nhé!',
      items: [
        { id: 'f1', name: 'Cá Hè', image: '/images/ca_1.png', audio: '/sounds/ting_exactly.mp3', soundText: 'Ủc ục ục!' },
        { id: 'f2', name: 'Cá Vàng', image: '/images/ca_2.png', audio: '/sounds/ting_exactly.mp3', soundText: 'Bơi tung tăng!' },
        { id: 'f3', name: 'Cá Nóc', image: '/images/ca_3.png', audio: '/sounds/ting_exactly.mp3', soundText: 'Ộp ộp ộp!' },
      ]
    },
    {
      id: 'chicken-nest',
      name: 'Ổ Trứng Gà',
      image: '/images/o_trung_ga_remove.png',
      introAudio: '/sounds/chicken_part_1.m4a', // 🔊 File âm thanh intro của Ổ Trứng Gà
      hint: 'Bấm vào các chú gà hoặc quả trứng xem điều kỳ diệu!',
      items: [
        { id: 'c1', name: 'Gà Con', image: '/images/ga_1.png', audio: '/sounds/ting_exactly.mp3', soundText: 'Chíp chíp chíp!' },
        { id: 'c2', name: 'Gà Trống', image: '/images/ga_2.png', audio: '/sounds/ting_exactly.mp3', soundText: 'Ò ó o o...' },
        { id: 'c3', name: 'Trứng Gà', image: '/images/ga_3.png', audio: '/sounds/ting_exactly.mp3', soundText: 'Lục đục sắp nở!' },
      ]
    },
    {
      id: 'dog-house',
      name: 'Chuồng Chó Ấm Áp',
      image: '/images/chuong_cho_remove.png',
      introAudio: '/sounds/dog_part_1.m4a', // 🔊 File âm thanh intro của Chuồng Chó Ấm Áp
      hint: 'Bấm vào cún con và đồ chơi xem bạn ấy làm gì nào!',
      items: [
        { id: 'd1', name: 'Cún Đốm', image: '/images/cho_1.png', audio: '/sounds/ting_exactly.mp3', soundText: 'Gâu gâu vẫy đuôi!' },
        { id: 'd2', name: 'Khúc Xương', image: '/images/cho_2.png', audio: '/sounds/ting_exactly.mp3', soundText: 'Gặm xương ngon quá!' },
        { id: 'd3', name: 'Cún Vàng', image: '/images/cho_3.png', audio: '/sounds/ting_exactly.mp3', soundText: 'Ú ú... mừng chủ!' },
      ]
    }
  ];

  get habitats(): Habitat[] {
    return this.HABITATS_DATA;
  }

  selectHabitat(habitatId: string) {
    // Dừng âm thanh cũ nếu đang phát khi chuyển khu vực
    this.stopCurrentAudio();

    this.selectedHabitatId.set(habitatId);
    const found = this.HABITATS_DATA.find(h => h.id === habitatId);

    if (found) {
      const shuffled = [...found.items].sort(() => 0.5 - Math.random());
      const selectedThree = shuffled.slice(0, 3);

      this.currentActiveHabitat = {
        ...found,
        items: selectedThree
      };

      // 🔊 Tự động phát file âm thanh intro ngay khi vào khu vực này
      if (found.introAudio) {
        this.playAudio(found.introAudio);
      }
    }
  }

  backToHabitats() {
    this.stopCurrentAudio();
    this.selectedHabitatId.set(null);
    this.currentActiveHabitat = null;
  }

  backToHome() {
    this.stopCurrentAudio();
    this.router.navigate(['/']);
  }

  // Hàm xử lý phát âm thanh cho con vật (tự động ngắt tiếng intro/âm thanh trước đó)
  playItemSound(item: HabitatItem) {
    this.playAudio(item.audio);
    console.log('Đang phát âm thanh con vật:', item.name);
  }

  // Hàm chung dùng để phát bất kỳ file audio nào và luôn ngắt audio đang chạy trước đó
  private playAudio(audioPath: string) {
    this.stopCurrentAudio();

    if (audioPath) {
      this.currentAudio = new Audio(audioPath);
      this.currentAudio.play().catch(err => {
        console.warn('Không thể phát file âm thanh:', err);
      });
    }
  }

  private stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }
}