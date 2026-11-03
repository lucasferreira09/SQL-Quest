import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompraDicas } from './compra-dicas';

describe('CompraDicas', () => {
  let component: CompraDicas;
  let fixture: ComponentFixture<CompraDicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraDicas],
    }).compileComponents();

    fixture = TestBed.createComponent(CompraDicas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
