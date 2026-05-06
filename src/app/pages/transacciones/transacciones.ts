import { Component, inject, OnInit } from '@angular/core';
import { TransaccionesService, Transaccion } from '../../services/transacciones';
import { CategoriasService, Categoria } from '../../services/categorias';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-transacciones',
  standalone: true,
  imports: [ButtonModule, TableModule, DialogModule, InputTextModule, SelectModule, FormsModule, CurrencyPipe, ToastModule],
  providers: [MessageService],
  templateUrl: './transacciones.html',
  styleUrl: './transacciones.scss'
})
export class Transacciones implements OnInit {
  private transaccionesService = inject(TransaccionesService);
  private categoriasService = inject(CategoriasService);
  private messageService = inject(MessageService);

  transacciones: Transaccion[] = [];
  categorias: Categoria[] = [];
  mostrarDialog = false;

  nueva: Transaccion = {
    concepto: '',
    importe: 0,
    tipo: 'gasto',
    categoria: '',
    fecha: new Date().toISOString().split('T')[0]
  };

  tipos = [
    { label: 'Gasto', value: 'gasto' },
    { label: 'Ingreso', value: 'ingreso' }
  ];

  ngOnInit(): void {
    this.transaccionesService.getAll().subscribe((data: Transaccion[]) => {
      this.transacciones = data;
    });
    this.categoriasService.getAll().subscribe((data: Categoria[]) => {
      this.categorias = data;
    });
  }

  abrirDialog(): void {
    this.nueva = {
      concepto: '',
      importe: 0,
      tipo: 'gasto',
      categoria: '',
      fecha: new Date().toISOString().split('T')[0]
    };
    this.mostrarDialog = true;
  }

  async guardar(): Promise<void> {
    if (!this.nueva.concepto || !this.nueva.importe) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor rellena el concepto y el importe'
      });
      return;
    }
    await this.transaccionesService.add(this.nueva);
    this.mostrarDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: '¡Éxito!',
      detail: `Transacción "${this.nueva.concepto}" guardada correctamente`
    });
  }

  async eliminar(id: string): Promise<void> {
    await this.transaccionesService.delete(id);
    this.messageService.add({
      severity: 'warn',
      summary: 'Eliminada',
      detail: 'Transacción eliminada correctamente'
    });
  }
}