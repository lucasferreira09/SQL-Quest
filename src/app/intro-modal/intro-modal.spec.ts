import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntroModal } from './intro-modal';

describe('IntroModal', () => {
  let component: IntroModal;
  let fixture: ComponentFixture<IntroModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroModal],
    }).compileComponents();

    fixture = TestBed.createComponent(IntroModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
