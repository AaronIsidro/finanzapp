import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DecimalPipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { firstValueFrom } from 'rxjs';

const API_KEY = '0532375b41ed93f6c408f409';

interface PuntoHistorico {
  fecha: string;
  tasa: number;
}

@Component({
  selector: 'app-divisas',
  standalone: true,
  imports: [FormsModule, CardModule, SelectModule, InputTextModule, DecimalPipe, ChartModule],
  templateUrl: './divisas.html',
  styleUrl: './divisas.scss'
})
export class Divisas implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  divisaOrigen = 'EUR';
  divisaDestino = 'USD';
  cantidad = 1;
  resultado = 0;
  tasaActual = 0;
  cargando = true;
  ultimaActualizacion = '';

  chartData: any = null;
  chartOptions: any = null;

  opcionesDivisas = [
    { label: '🇪🇺 Euro (EUR)', value: 'EUR' },
    { label: '🇺🇸 Dólar (USD)', value: 'USD' },
    { label: '🇬🇧 Libra (GBP)', value: 'GBP' },
    { label: '🇯🇵 Yen (JPY)', value: 'JPY' },
    { label: '🇨🇭 Franco Suizo (CHF)', value: 'CHF' },
    { label: '🇨🇦 Dólar Canadiense (CAD)', value: 'CAD' },
    { label: '🇦🇺 Dólar Australiano (AUD)', value: 'AUD' },
    { label: '🇨🇳 Yuan (CNY)', value: 'CNY' },
    { label: '🇲🇽 Peso Mexicano (MXN)', value: 'MXN' },
    { label: '🇧🇷 Real Brasileño (BRL)', value: 'BRL' },
  ];

  ngOnInit(): void {
    this.initChartOptions();
    this.cargarTasas();
  }

  initChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#f1f5f9' } }
      }
    };
  }

  async cargarTasas(): Promise<void> {
    this.cargando = true;
    this.cdr.detectChanges();
    try {
      const data = await firstValueFrom(
        this.http.get<any>(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${this.divisaOrigen}`)
      );
      this.tasaActual = data.conversion_rates[this.divisaDestino];
      this.resultado = this.cantidad * this.tasaActual;
      this.ultimaActualizacion = data.time_last_update_utc;
      this.guardarEnLocalStorage();
      this.actualizarGrafica();
    } catch (err) {
      console.error('Error al cargar tasas:', err);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  private getStorageKey(): string {
    return `historico_${this.divisaOrigen}_${this.divisaDestino}`;
  }

  private getFechaHoy(): string {
    const hoy = new Date();
    return `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
  }

  guardarEnLocalStorage(): void {
    const key = this.getStorageKey();
    const historico: PuntoHistorico[] = JSON.parse(localStorage.getItem(key) || '[]');
    const fechaHoy = this.getFechaHoy();

    // Solo guardar una vez por día
    const yaExiste = historico.find(p => p.fecha === fechaHoy);
    if (!yaExiste) {
      historico.push({ fecha: fechaHoy, tasa: this.tasaActual });
      localStorage.setItem(key, JSON.stringify(historico));
    }
  }

  actualizarGrafica(): void {
    const key = this.getStorageKey();
    const historico: PuntoHistorico[] = JSON.parse(localStorage.getItem(key) || '[]');

    if (historico.length === 0) {
      this.chartData = null;
      return;
    }

    this.chartData = {
      labels: historico.map(p => p.fecha),
      datasets: [{
        label: `1 ${this.divisaOrigen} en ${this.divisaDestino}`,
        data: historico.map(p => p.tasa),
        fill: true,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointRadius: 5
      }]
    };
    this.cdr.detectChanges();
  }

  convertir(): void {
    this.resultado = this.cantidad * this.tasaActual;
  }

  cambiarDivisa(): void {
    this.cargarTasas();
  }
}