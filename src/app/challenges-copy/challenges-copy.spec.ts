import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengesCopy } from './challenges-copy';

describe('ChallengesCopy', () => {
  let component: ChallengesCopy;
  let fixture: ComponentFixture<ChallengesCopy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengesCopy],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengesCopy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
