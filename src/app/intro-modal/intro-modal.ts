import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-intro-modal',
  standalone: true,
  imports: [],
  templateUrl: './intro-modal.html',
  styleUrl: './intro-modal.scss'
})
export class IntroModal {

  @Output()
  fechar = new EventEmitter<void>();

  fecharModal(): void {
    this.fechar.emit();
  }
}