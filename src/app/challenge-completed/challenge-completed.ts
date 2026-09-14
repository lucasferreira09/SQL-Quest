import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-challenge-completed',
  styleUrl: './challenge-completed.scss',
  templateUrl: './challenge-completed.html',
})
export class ChallengeCompleted {

  xp = 50;
  difficulty = 'Fácil';

  nextChallenge(): void {
    console.log('Indo para o próximo desafio...');
  }

  back(): void {
    window.history.back();
  }
  
}
