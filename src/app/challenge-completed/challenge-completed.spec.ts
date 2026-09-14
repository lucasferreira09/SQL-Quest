import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeCompleted } from './challenge-completed';

describe('ChallengeCompleted', () => {
  let component: ChallengeCompleted;
  let fixture: ComponentFixture<ChallengeCompleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeCompleted],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeCompleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
