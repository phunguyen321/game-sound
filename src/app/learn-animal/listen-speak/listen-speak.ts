import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
export class ListenSpeak implements OnInit, OnDestroy {
  private currentAudio: HTMLAudioElement | null = null;

  // Lưu trữ id của khu vực đang được chọn/phát
  selectedHabitatId: string | null = null;
  router = inject(Router);

  // Biến quản lý âm thanh intro khi vừa vào màn hình
  private introAudio: HTMLAudioElement | null = null;
  // Biến quản lý âm thanh tương tác của con vật (nếu cần)
  private interactionAudio: HTMLAudioElement | null = null;
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
      image: '/images/cho_vay_duoi.png',
      gif: '/images/cho_vay_duoi_animated.gif',
      audio: '/sounds/audio_cho_sua.mp3'
    },
    {
      id: 'chicken-nest',
      name: 'Ổ Trứng Gà',
      image: '/images/me_ga.png',
      gif: '/images/me_ga_animated.gif',
      audio: '/sounds/audio_ga_gay.mp3'
    }
  ];

  ngOnInit(): void {
    this.playIntroAudio();
  }

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

  backToHome() {
    this.stopCurrentAudio();
    this.stopAllAudio();
    this.selectedHabitatId = null;
    console.log('Đã trở về Menu Chính / Home');
    // Thêm logic điều hướng về trang Home của bạn ở đây (nếu dùng Angular Router: this.router.navigate(['/home']);)
    this.router.navigate(['/'])
  }

  private playIntroAudio() {
    try {
      // Thay đổi đường dẫn đến file mp3 giới thiệu màn hình của bạn
      this.introAudio = new Audio('/sounds/part_2.m4a');
      this.introAudio.play().catch(error => {
        console.log("Trình duyệt chặn tự động phát âm thanh:", error);
      });
    } catch (e) {
      console.error("Lỗi khởi tạo file audio intro:", e);
    }
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

  ngOnDestroy(): void {
    this.stopAllAudio();
  }
}
