import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CardModule, InputTextModule, ButtonModule, ToastModule, PasswordModule],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  email = '';
  password = '';
  modoRegistro = false;
  cargando = false;

  async submit(): Promise<void> {
    if (!this.email || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor rellena el email y la contraseña'
      });
      return;
    }

    this.cargando = true;
    try {
      if (this.modoRegistro) {
        await this.authService.registro(this.email, this.password);
        this.messageService.add({
          severity: 'success',
          summary: '¡Cuenta creada!',
          detail: 'Tu cuenta ha sido creada correctamente'
        });
      } else {
        await this.authService.login(this.email, this.password);
      }
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.getErrorMessage(error.code)
      });
    } finally {
      this.cargando = false;
    }
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-email': return 'Email no válido';
      case 'auth/user-not-found': return 'Usuario no encontrado';
      case 'auth/wrong-password': return 'Contraseña incorrecta';
      case 'auth/email-already-in-use': return 'El email ya está en uso';
      case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/invalid-credential': return 'Email o contraseña incorrectos';
      default: return 'Ha ocurrido un error, inténtalo de nuevo';
    }
  }
}