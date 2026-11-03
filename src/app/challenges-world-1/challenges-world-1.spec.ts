import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengesWorld1 } from './challenges-world-1';

describe('ChallengesWorld1', () => {
  let component: ChallengesWorld1;
  let fixture: ComponentFixture<ChallengesWorld1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengesWorld1],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengesWorld1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
