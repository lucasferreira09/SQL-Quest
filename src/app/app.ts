import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeScreen } from './home-screen/home-screen';
import { MundoDesafios } from './mundo-desafios/mundo-desafios';

@Component({
  imports: [RouterOutlet, HomeScreen, MundoDesafios],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('SQL_Quest');
}
