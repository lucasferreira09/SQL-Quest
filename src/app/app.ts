import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeScreen } from './home-screen/home-screen';
import { Challenges } from './challenges/challenges';
import { ChallengeCompleted } from './challenge-completed/challenge-completed';
import { ChallengeFailed } from './challenge-failed/challenge-failed';

@Component({
  imports: [RouterOutlet, HomeScreen, Challenges, ChallengeCompleted, ChallengeFailed],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('SQL_Quest');
}
