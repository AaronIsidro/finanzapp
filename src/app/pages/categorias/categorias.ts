import { Component, inject, OnInit } from '@angular/core';
import { CategoriasService, Categoria } from '../../services/categorias';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [ButtonModule, TableModule, DialogModule, InputTextModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss'
})
export class Categorias implements OnInit {
  private categoriasService = inject(CategoriasService);
  private messageService = inject(MessageService);

  categorias: Categoria[] = [];
  mostrarDialog = false;
  nueva: Categoria = { nombre: '', icono: '' };

  ngOnInit(): void {
    this.categoriasService.getAll().subscribe((data: Categoria[]) => {
      this.categorias = data;
    });
  }

  abrirDialog(): void {
    this.nueva = { nombre: '', icono: '' };
    this.mostrarDialog = true;
  }

  async guardar(): Promise<void> {
    if (!this.nueva.nombre) return;
    await this.categoriasService.add(this.nueva);
    this.mostrarDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: '¡Éxito!',
      detail: `Categoría "${this.nueva.nombre}" registrada correctamente`
    });
  }

  async eliminar(id: string): Promise<void> {
    await this.categoriasService.delete(id);
    this.messageService.add({
      severity: 'warn',
      summary: 'Eliminada',
      detail: 'Categoría eliminada correctamente'
    });
  }
}