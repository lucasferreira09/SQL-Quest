import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-home-screen',
  styleUrl: './home-screen.scss',
  templateUrl: './home-screen.html',
})

export class HomeScreen {

  playButton = 'Jogar';
  optionsButton = 'Opções'
  exitButton = 'Sair'


   play(): void {
    console.log('Play');
  }

  options(): void {
    console.log('Opções');
  }

  exit(): void {
    console.log('Sair');
  }
  
}
