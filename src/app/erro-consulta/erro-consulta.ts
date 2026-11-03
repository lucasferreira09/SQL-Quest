import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-erro-consulta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './erro-consulta.html',
  styleUrls: ['./erro-consulta.scss']
})
export class ErroConsulta {

  // Consulta SQL recebida do componente pai
  @Input() consulta = '';

  // Ações enviadas ao componente pai
  @Output() tentarNovamente = new EventEmitter<void>();
  @Output() voltarMapa = new EventEmitter<void>();

  feedback = 'Sua consulta não retornou o resultado esperado. Verifique os detalhes abaixo e tente novamente.';

  dicas: string[] = [
    'Verifique se o nome da tabela e das colunas está correto.',
    'Confira se os valores utilizados existem no banco de dados.',
    'Verifique se os operadores e as condições da consulta estão corretos.',
    'Confira se a consulta atende ao objetivo do desafio.'
  ];

  tentar(): void {
    this.tentarNovamente.emit();
  }

  voltar(): void {
    this.voltarMapa.emit();
  }
}