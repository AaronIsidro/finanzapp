import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  items: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
    { label: 'Transacciones', icon: 'pi pi-list', routerLink: '/transacciones' },
    { label: 'Categorías', icon: 'pi pi-tag', routerLink: '/categorias' },
    { label: 'Divisas', icon: 'pi pi-globe', routerLink: '/divisas' }
  ];

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
