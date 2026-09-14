import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-challenge-failed',
  styleUrl: './challenge-failed.scss',
  templateUrl: './challenge-failed.html',
})
export class ChallengeFailed {
  
  messageFailed = 'Your request does not return the value expected';
  messageFailedPT = 'Sua consulta não retornou o resultado esperado'

  tip ='Verify if the table name is correct or if the filter of the WHERE is working as expected.'
  tipPT = 'Verifique se o nome da tabela está correto e se o filtro do WHERE está funcionando como esperado.';

  tryAgain(): void {
    console.log('Trying the challenge again...');
  }

  showTips(): void {
    console.log('Opening Tips...');
  }

  back(): void {
    window.history.back();
  }
}
