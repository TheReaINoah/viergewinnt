import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

export enum CellType {
  Empty = 'empty',
  Red = 'red',
  Yellow = 'yellow',
}

export enum Player {
  ONE = 'PlayerOne',
  TWO = 'PlayerTwo',
}

type CheckResult = Player | 'draw' | 'notDecided';

@Component({
  imports: [RouterOutlet, NgOptimizedImage],
  selector: 'app-root',
  styleUrl: '../styles.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly grid = signal(this.createGameGrid({ rows: 6, columns: 7 }));
  protected readonly currentPlayer = signal<Player>(Player.ONE);
  protected readonly playerOne = Player.ONE;
  protected readonly playerTwo = Player.TWO;
  protected readonly playerOneScore = signal<number>(0);
  protected readonly playerTwoScore = signal<number>(0);

  private createGameGrid({ rows, columns }: { rows: number; columns: number }): CellType[][] {
    const grid: CellType[][] = [];

    for (let row = 0; row < rows; row++) {
      const currentRow: CellType[] = [];
      for (let column = 0; column < columns; column++) {
        currentRow.push(CellType.Empty);
      }
      grid.push(currentRow);
    }

    return grid;
  }

  protected placeToken(row: number, column: number): void {
    const currentGrid = this.grid();
    if (row < 0 || column < 0 || row >= currentGrid.length || column >= currentGrid[row].length) {
      return;
    }

    const targetRow = this.findLowestEmptyRow(currentGrid, column);
    if (targetRow === null || row !== targetRow || currentGrid[row][column] !== CellType.Empty) {
      return;
    }

    const nextCell = this.currentPlayer() === Player.ONE ? CellType.Yellow : CellType.Red;

    this.grid.update((cells) => {
      const nextGrid = cells.map((currentRow) => [...currentRow]);
      nextGrid[row][column] = nextCell;
      return nextGrid;
    });

    this.checkWinHorizontal(this.grid());
    this.checkWinVertical(this.grid());
    this.checkWinDiagonalLeft(this.grid());
    this.checkWinDiagonalRight(this.grid());

    this.currentPlayer.update((player) => (player === Player.ONE ? Player.TWO : Player.ONE));
  }

  private findLowestEmptyRow(grid: CellType[][], column: number): number | null {
    for (let row = grid.length - 1; row >= 0; row--) {
      if (grid[row][column] === CellType.Empty) {
        return row;
      }
    }
    return null;
  }

  private gridReset(CheckResult: CheckResult): void {

    if (CheckResult != 'notDecided') {
      alert('Game Over! Resetting the grid.');
      this.grid.set(this.createGameGrid({ rows: 6, columns: 7 }));
      this.currentPlayer.set(Player.ONE);
    }
  }
  private checkWinDiagonalLeft(grid: CellType[][]): CheckResult {
    for (let row = 0; row < grid.length - 3; row++) {
      for (let column = 0; column < grid[row].length - 3; column++) {
        const cell = grid[row][column];
        if (
          cell !== CellType.Empty &&
          cell === grid[row + 1][column + 1] &&
          cell === grid[row + 2][column + 2] &&
          cell === grid[row + 3][column + 3]
        ) {
          const winner = cell === CellType.Yellow ? Player.ONE : Player.TWO;
          alert(`Player ${winner === Player.ONE ? 'ONE' : 'TWO'} wins!`);
          this.currentScoreboard(winner);
          this.gridReset(winner);
          return winner;
        }
      }
    }
    return 'notDecided';
  }

  private checkWinDiagonalRight(grid: CellType[][]): CheckResult {
    for (let row = 0; row < grid.length - 3; row++) {
      for (let column = 3; column < grid[row].length; column++) {
        const cell = grid[row][column];
        if (
          cell !== CellType.Empty &&
          cell === grid[row + 1][column - 1] &&
          cell === grid[row + 2][column - 2] &&
          cell === grid[row + 3][column - 3]
        ) {
          const winner = cell === CellType.Yellow ? Player.ONE : Player.TWO;
          alert(`Player ${winner === Player.ONE ? 'ONE' : 'TWO'} wins!`);
          this.currentScoreboard(winner);
          this.gridReset(winner);
          return winner;
        }
      }
    }
    return 'notDecided';
  }

  private checkWinHorizontal(grid: CellType[][]): CheckResult {
    for (let row = 0; row < grid.length; row++) {
      let countstreak = 0;
      let lastCell: CellType | null = null;

      for (let column = 0; column < grid[row].length; column++) {
        const cell = grid[row][column];

        if (cell === CellType.Empty) {
          countstreak = 0;
          lastCell = null;
          continue;
        }
        if (cell === lastCell) {
          countstreak++;
        } else {
          countstreak = 1;
          lastCell = cell;
        }

        if (countstreak >= 4) {
          const winner = cell === CellType.Yellow ? Player.ONE : Player.TWO;
          alert(`Player ${winner === Player.ONE ? 'ONE' : 'TWO'} wins!`);
          this.currentScoreboard(winner);
          this.gridReset(winner);
          return winner;
        }
      }
    }
    this.gridReset('notDecided');
    return 'notDecided';
  }

  private checkWinVertical(grid: CellType[][]): CheckResult {
    for (let column = 0; column < grid[0].length; column++) {
      let countstreak = 0;
      let lastCell: CellType | null = null;

      for (let row = 0; row < grid.length; row++) {
        const cell = grid[row][column];

        if (cell === CellType.Empty) {
          countstreak = 0;
          lastCell = null;
          continue;
        }
        if (cell === lastCell) {
          countstreak++;
        } else {
          countstreak = 1;
          lastCell = cell;
        }

        if (countstreak >= 4) {
          const winner = cell === CellType.Yellow ? Player.ONE : Player.TWO;
          alert(`Player ${winner === Player.ONE ? 'ONE' : 'TWO'} wins!`);
          this.currentScoreboard(winner);
          this.gridReset(winner);
          return winner;
        }
      }
    }
    return 'notDecided';
  }

  protected togglePlayer(): void {
    this.currentPlayer.update((player) => (player === Player.ONE ? Player.TWO : Player.ONE));
  }

  protected currentScoreboard(currentPlayer: Player) : void {
    if (currentPlayer === Player.ONE) {
      this.playerOneScore.update(score => score + 1);
    } else if (currentPlayer === Player.TWO) {
      this.playerTwoScore.update(score => score + 1);
    }
  }
}
