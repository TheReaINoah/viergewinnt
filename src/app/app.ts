import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

enum CellType {
  Empty = 'empty',
  Red = 'red',
  Yellow = 'yellow',
}
export { CellType };

function createGrid({ rows, columns }: { rows: number; columns: number }) {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push(CellType.Empty);
    }
    grid.push(row);
  }
  return grid;
}

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: '../styles.css',
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('4Gewinnt');
}
