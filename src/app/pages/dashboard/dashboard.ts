import { Component, inject, OnInit } from '@angular/core';
import { TransaccionesService, Transaccion } from '../../services/transacciones';
import { CardModule } from 'primeng/card';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private transaccionesService = inject(TransaccionesService);

  transacciones: Transaccion[] = [];
  totalIngresos = 0;
  totalGastos = 0;
  saldo = 0;
  ultimasTransacciones: Transaccion[] = [];

  ngOnInit(): void {
    this.transaccionesService.getAll().subscribe((data: Transaccion[]) => {
      this.transacciones = data;
      this.calcularTotales();
    });
  }

  calcularTotales(): void {
    this.totalIngresos = this.transacciones
      .filter(t => t.tipo === 'ingreso')
      .reduce((acc, t) => acc + t.importe, 0);

    this.totalGastos = this.transacciones
      .filter(t => t.tipo === 'gasto')
      .reduce((acc, t) => acc + t.importe, 0);

    this.saldo = this.totalIngresos - this.totalGastos;

    this.ultimasTransacciones = [...this.transacciones]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);
  }
}