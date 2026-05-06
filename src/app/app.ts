import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  private router = inject(Router);
  mostrarNavbar = true;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.mostrarNavbar = event.url !== '/login';
    });
  }
}
