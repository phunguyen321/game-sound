import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
interface Habitat {
  id: string;
  name: string;
  image: string;     // Đường dẫn ảnh tĩnh (PNG)
  gif: string;       // Đường dẫn ảnh động (GIF)
  audio: string;     // Đường dẫn file MP3
}
@Component({
  selector: 'app-listen-speak',
  imports: [],
  templateUrl: './listen-speak.html',
  styleUrl: './listen-speak.scss',
})
export class ListenSpeak {
  private currentAudio: HTMLAudioElement | null = null;

  // Lưu trữ id của khu vực đang được chọn/phát
  selectedHabitatId: string | null = null;
  router = inject(Router);

  readonly HABITATS: Habitat[] = [
    {
      id: 'lake',
      name: 'Cái Hồ Xanh Mát',
      image: '/images/ao_ca_1.png',
      gif: '/images/ca_boi.gif',
      audio: '/sounds/audio_ca_boi.mp3'
    },
    {
      id: 'dog-house',
      name: 'Chuồng Chó Ấm Áp',
      image: '/images/ao_ca_1.png',
      gif: '/images/ca_boi.gif',
      audio: '/sounds/audio_cho_sua.mp3'
    },
    {
      id: 'chicken-nest',
      name: 'Ổ Trứng Gà',
      image: '/images/ao_ca_1.png',
      gif: '/images/ca_boi.gif',
      audio: '/sounds/audio_ga_gay.mp3'
    }
  ];

  selectHabitat(habitat: Habitat) {
    // Nếu bấm lại vào chính hình đang chọn -> Tắt âm thanh, trả về hình tĩnh, bỏ chọn
    if (this.selectedHabitatId === habitat.id) {
      this.stopCurrentAudio();
      this.selectedHabitatId = null;
      console.log('Đã tắt:', habitat.name);
      return;
    }

    // Nếu chọn hình khác -> Dừng âm thanh cũ trước đó
    this.stopCurrentAudio();

    // Cập nhật trạng thái đang chọn
    this.selectedHabitatId = habitat.id;

    // Phát âm thanh mới
    if (habitat.audio) {
      this.currentAudio = new Audio(habitat.audio);
      this.currentAudio.play().catch(err => {
        console.warn('Không thể phát file âm thanh:', err);
      });
    }

    console.log('Bé đang khám phá:', habitat.name);
  }

  private stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  goHome() {
    this.stopCurrentAudio();
    this.selectedHabitatId = null;
    console.log('Đã trở về Menu Chính / Home');
    // Thêm logic điều hướng về trang Home của bạn ở đây (nếu dùng Angular Router: this.router.navigate(['/home']);)
    this.router.navigate(['/'])
  }
}
