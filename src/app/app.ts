import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

enum CellType {
  Empty = "empty",
  Red = "red",
  Yellow = "yellow"
}
export { CellType };
export class App {
  protected readonly title = signal('4Gewinnt');
}
