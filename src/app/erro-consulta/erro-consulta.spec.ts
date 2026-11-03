import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErroConsulta } from './erro-consulta';

describe('ErroConsulta', () => {
  let component: ErroConsulta;
  let fixture: ComponentFixture<ErroConsulta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErroConsulta],
    }).compileComponents();

    fixture = TestBed.createComponent(ErroConsulta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
