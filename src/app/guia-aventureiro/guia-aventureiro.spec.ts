import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuiaAventureiro } from './guia-aventureiro';

describe('GuiaAventureiro', () => {
  let component: GuiaAventureiro;
  let fixture: ComponentFixture<GuiaAventureiro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiaAventureiro],
    }).compileComponents();

    fixture = TestBed.createComponent(GuiaAventureiro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
