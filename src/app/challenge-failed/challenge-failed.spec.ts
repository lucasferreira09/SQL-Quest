import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeFailed } from './challenge-failed';

describe('ChallengeFailed', () => {
  let component: ChallengeFailed;
  let fixture: ComponentFixture<ChallengeFailed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeFailed],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeFailed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
