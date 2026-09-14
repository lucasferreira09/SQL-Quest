import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-challenge-failed',
  styleUrl: './challenge-failed.scss',
  templateUrl: './challenge-failed.html',
})
export class ChallengeFailed {
  
 
  tip = 'Verifique se o nome da tabela está correto e se o filtro do WHERE está funcionando como esperado.';

  tryAgain(): void {
    console.log('Tentando o desafio novamente...');
  }

  showTips(): void {
    console.log('Abrindo dicas...');
  }

  back(): void {
    window.history.back();
  }
}
