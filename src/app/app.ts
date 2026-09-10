import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

enum CellType {
  Empty = 'empty',
  Red = 'red',
  Yellow = 'yellow',
}
export { CellType };

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: '../styles.css',
  templateUrl: './app.html',
})

export class App {
  protected readonly title = signal('4Gewinnt');
}
