import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: '../styles.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('4Gewinnt');
  protected readonly grid = signal(this.createGrid({ rows: 6, columns: 7 }));
  protected readonly currentPlayer = signal<Player>(Player.ONE);

  private createGrid({ rows, columns }: { rows: number; columns: number }): CellType[][] {
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

  private checkWin(grid: CellType[][]): CheckResult {
    const rows = grid.length;
    const columns = grid[0]?.length ?? 0;

    if (rows < 4 || columns < 4) {
      return 'notDecided';
    }
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const cell = grid[row][column];

        if (cell === CellType.Empty) {
          continue;
        }

        const player = cell === CellType.Red ? Player.ONE : Player.TWO;

        if (
          column <= columns - 4 &&
          grid[row][column + 1] === cell &&
          grid[row][column + 2] === cell &&
          grid[row][column + 3] === cell
        ) {
          return player;
        }
      }
    }
    return 'notDecided';
  }

  protected togglePlayer(): void {
    this.currentPlayer.update((player) => (player === Player.ONE ? Player.TWO : Player.ONE));
  }
}
