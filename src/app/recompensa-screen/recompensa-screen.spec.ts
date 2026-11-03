import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecompensaScreen } from './recompensa-screen';

describe('RecompensaScreen', () => {
  let component: RecompensaScreen;
  let fixture: ComponentFixture<RecompensaScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecompensaScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(RecompensaScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
