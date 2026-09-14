import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-challenge-completed',
  styleUrl: './challenge-completed.scss',
  templateUrl: './challenge-completed.html',
})
export class ChallengeCompleted {

  xp = 50;
  difficulty = 'Easy';

  nextChallenge(): void {
    console.log('Getting the next challenge...');
  }

  back(): void {
    window.history.back();
  }
  
}
