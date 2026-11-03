import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MundoDesafios } from './mundo-desafios';

describe('Challenges', () => {
  let component: MundoDesafios;
  let fixture: ComponentFixture<MundoDesafios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MundoDesafios],
    }).compileComponents();

    fixture = TestBed.createComponent(MundoDesafios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
