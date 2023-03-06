import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'craps-game',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: 'main.html',
  styleUrls: ['global_styles.css'],
})
export class CrapsGame {
  constructor(public dialog: MatDialog) {}

  protected gamesPlayed: Game[] = [];
  protected diceRolls: number[] = [];
  protected gameResult: GameResult;

  public winningRolls = [7, 11];
  public losingRolls = [2, 3, 12];

  protected currentGame: number = 1;
  public numberOfGames: number = 0;
  protected gameOver: boolean = false;
  protected showStats: boolean = false;

  protected rollResult: number;
  protected dice1: number;
  protected dice2: number;

  showRules(templateRef) {
    this.dialog.open(templateRef, {
      width: '400px',
    });
  }

  public startGame(gamesToPlay: string) {
    let number = Number.parseInt(gamesToPlay);
    this.numberOfGames = number ?? 0;
  }

  public rollDice() {
    this.rollResult = 0;
    this.dice1 = Math.floor(Math.random() * (6 - 1) + 1);
    this.dice2 = Math.floor(Math.random() * (6 - 1) + 1);
    console.log('Dice Roll Result: ', this.dice1 + this.dice2);

    this.diceRolls.push(this.dice1 + this.dice2);
    console.log('Dice Roll Count: ', this.diceRolls);
    this.rollResult += this.dice1 + this.dice2;

    this.handleDiceRoll();
  }

  handleDiceRoll() {
    if (
      this.winningRolls.includes(this.rollResult) ||
      this.losingRolls.includes(this.rollResult)
    ) {
      this.gamesPlayed.push(
        new Game(
          this.diceRolls,
          this.winningRolls.includes(this.rollResult) ? true : false
        )
      );
      console.log('currentGame: ', this.currentGame);
      if (this.currentGame == this.numberOfGames) {
        setTimeout(() => {
          this.gameOver = true;
          this.showGameStats();
        },2500);
      }
    }
  }

  public startNextGame() {
    this.currentGame++;
    this.rollResult = 0;
    this.diceRolls = [];
  }

  showGameStats() {
    this.gameResult = new GameResult();
    let gameRolls: number[] = [];
    this.gamesPlayed.forEach((g) => gameRolls.push(...g.Rolls));
    console.log('gameRolls', gameRolls);

    let rollsCountPerGame: number[] = [];
    this.gamesPlayed.forEach((g) => rollsCountPerGame.push(g.Rolls.length));
    console.log('rollsCountPerGame', rollsCountPerGame);

    this.gameResult.averageRolls =
      rollsCountPerGame?.reduce((sum, r) => sum + r) / this.gamesPlayed.length;

    this.gameResult.highestRolls = Math.max(...gameRolls);

    this.gameResult.lowestRolls = Math.min(...gameRolls);

    this.gameResult.mostCommonRoll = gameRolls.sort((a, b) => b - a)[0];
    console.log('mostCommonRoll', this.gameResult.mostCommonRoll);

    this.gameResult.wins = this.gamesPlayed
      .map((g) => g.Result)
      .filter((r) => r == true)?.length;

    this.gameResult.losses = this.gamesPlayed
      .map((g) => g.Result)
      .filter((r) => r == false)?.length;

    this.gameResult.winningPercentage = `${(
      (this.gameResult.wins / this.gamesPlayed.length) *
      100
    ).toFixed(2)}%`;

    console.log('winningPercentage', this.gameResult.winningPercentage);
    console.log('losses', this.gameResult.losses);
    console.log('wins', this.gameResult.wins);
    console.log('lowestRolls', this.gameResult.lowestRolls);
    console.log('highestRolls', this.gameResult.highestRolls);
    console.log('averageRolls', this.gameResult.averageRolls);
  }

  public resetGame() {
    this.gameOver = false;
    this.showStats = false;
    this.gameResult = null;
    this.gamesPlayed = [];
    this.diceRolls = [];
    this.numberOfGames = 0;
    this.rollResult = 0;
    this.currentGame = 1;
  }
}

export class Game {
  Rolls: number[];
  Result: boolean; // Lose = false | Win = true

  constructor(roll: number[], result: boolean) {
    this.Rolls = roll;
    this.Result = result;
  }
}

export class GameResult {
  averageRolls: number;
  highestRolls: number;
  lowestRolls: number;
  mostCommonRoll: number;
  winningPercentage: string;
  wins: number;
  losses: number;
}

bootstrapApplication(CrapsGame);
