import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySound } from './play-sound';

describe('PlaySound', () => {
  let component: PlaySound;
  let fixture: ComponentFixture<PlaySound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaySound],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaySound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
