import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

export type AnimalHabitat = 'lake' | 'chicken-nest' | 'dog-house';

@Component({
  selector: 'app-find-animal',
  imports: [],
  templateUrl: './find-animal.html',
  styleUrl: './find-animal.scss',
})
export class FindAnimal {
  // Khu vực đang được chọn (null nghĩa là đang ở menu chọn 3 khu vực)
  selectedHabitat = signal<AnimalHabitat | null>(null);

  constructor(private router: Router) { }

  // Chọn khu vực
  selectHabitat(habitat: AnimalHabitat) {
    this.selectedHabitat.set(habitat);
    console.log(`Bé đang khám phá khu vực: ${habitat}`);
  }

  // Quay lại menu chọn khu vực
  backToHabitats() {
    this.selectedHabitat.set(null);
  }

  // Quay lại màn hình chính tổng (Menu game)
  backToHome() {
    this.router.navigate(['/']);
  }
}
