import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-home-screen',
  styleUrl: './home-screen.scss',
  templateUrl: './home-screen.html',
})

export class HomeScreen {

   play(): void {
    console.log('Jogar');
  }

  options(): void {
    console.log('Opções');
  }

  exit(): void {
    console.log('Sair');
  }
  
}
