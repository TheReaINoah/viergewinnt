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
  protected readonly grid = signal(this.gameGrid({ rows: 6, columns: 7 }));
  protected readonly currentPlayer = signal<Player>(Player.ONE);
  protected readonly playerOne = Player.ONE;
  protected readonly playerTwo = Player.TWO;

  private gameGrid({ rows, columns }: { rows: number; columns: number }): CellType[][] {
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
