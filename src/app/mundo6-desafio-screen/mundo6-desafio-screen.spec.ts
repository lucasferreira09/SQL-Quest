import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mundo6DesafioScreen } from './mundo6-desafio-screen';

describe('Mundo6DesafioScreen', () => {
  let component: Mundo6DesafioScreen;
  let fixture: ComponentFixture<Mundo6DesafioScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mundo6DesafioScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(Mundo6DesafioScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
