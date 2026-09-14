import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  glowColor: string;
  glowColorStrong: string;
}

@Component({
  imports: [CommonModule],
  selector: 'app-challenges-copy',
  styleUrl: './challenges-copy.scss',
  templateUrl: './challenges-copy.html',
})
export class ChallengesCopy {

  
  progress = 94;

  challenges: Challenge[] = [

    {
      id: '1',
      title: 'First request',
      difficulty: 'Easy',
      description: 'Learn how to do your first request using SELECT',
      glowColor: 'rgba(94, 255, 0, 0.85)',
      glowColorStrong: 'rgba(94, 255, 0, 0.70)'
    },

    {
      id: '2',
      title: 'Selecting data',
      difficulty: 'Easy',
      description: 'Practice how to select differents table fields.',
      glowColor: 'rgba(99, 49, 2, 0.85)',
      glowColorStrong: 'rgba(99, 49, 2, 0.70)'
    },

    {
      id: '3',
      title: 'Filtering results',
      difficulty: 'Easy',
      description: 'Use WHERE to find specific data',
      glowColor: 'rgba(31, 237, 252, 0.85)',
      glowColorStrong: 'rgba(31, 237, 252, 0.70)'
    },

    {
      id: '4',
      title: 'Ordering results',
      difficulty: 'Medium',
      description: 'Learn how to organize data results using ORDER BY',
      glowColor: 'rgb(0, 80, 49)',
      glowColorStrong: 'rgb(0, 80, 49)'
    },

    {
      id: '5',
      title: 'Grouping data',
      difficulty: 'Medium',
      description: 'Use GROUP BY to group table informations',
      glowColor: '#389bf8',
      glowColorStrong: '#389bf8'
    },

    {
      id: '6',
      title: 'Table relations',
      difficulty: 'Medium',
      description: 'Use JOIN to combine information of different tables',
      glowColor: '#fc7608',
      glowColorStrong: '#fc7608'
    },

  ];

  challengesPT: Challenge[] = [

    {
      id: '1',
      title: 'Primeira consulta',
      difficulty: 'Fácil',
      description: 'Aprenda a realizar sua primeira consulta utilizando SELECT.',
      glowColor: 'rgba(94, 255, 0, 0.85)',
      glowColorStrong: 'rgba(94, 255, 0, 0.70)'
    },

    {
      id: '2',
      title: 'Selecionando dados',
      difficulty: 'Fácil',
      description: 'Pratique como selecionar diferentes campos de uma tabela.',
      glowColor: 'rgba(99, 49, 2, 0.85)',
      glowColorStrong: 'rgba(99, 49, 2, 0.70)'
    },

    {
      id: '3',
      title: 'Filtrando resultados',
      difficulty: 'Fácil',
      description: 'Utilize a cláusula WHERE para encontrar dados específicos.',
      glowColor: 'rgba(31, 237, 252, 0.85)',
      glowColorStrong: 'rgba(31, 237, 252, 0.70)'
    },

    {
      id: '4',
      title: 'Ordenando resultados',
      difficulty: 'Médio',
      description: 'Aprenda a organizar os resultados utilizando ORDER BY.',
      glowColor: 'rgb(0, 80, 49)',
      glowColorStrong: 'rgb(0, 80, 49)'
    },

    {
      id: '5',
      title: 'Agrupando dados',
      difficulty: 'Médio',
      description: 'Utilize GROUP BY para agrupar informações de uma tabela.',
      glowColor: '#389bf8',
      glowColorStrong: '#389bf8'
    },

    {
      id: '6',
      title: 'Relacionando tabelas',
      difficulty: 'Médio',
      description: 'Utilize JOIN para combinar informações de diferentes tabelas.',
      glowColor: '#fc7608',
      glowColorStrong: '#fc7608'
    },

  ];


  selectedChallenge: Challenge = this.challenges[0];

  hoveredChallenge: Challenge | null = null;
  
  getChallengeFilter(challenge: Challenge): string {
    const isSelected = this.selectedChallenge.id === challenge.id;
    const isHovered = this.hoveredChallenge?.id === challenge.id;

    if (!isSelected && !isHovered) {
      return 'none';
    }

    return `
      drop-shadow(0 0 8px ${challenge.glowColor})
      drop-shadow(0 0 20px ${challenge.glowColorStrong})
      drop-shadow(0 8px 10px rgba(0, 0, 0, 0.45))
    `;
  }

  
  selectChallenge(challenge: Challenge): void {
    this.selectedChallenge  = challenge;
  }


  startChallenge(): void {
    console.log('Desafio selecionado:', this.selectedChallenge);
  }


  back(): void {
    window.history.back();
  }
}
