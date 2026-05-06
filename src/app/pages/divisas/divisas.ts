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
  cargandoGrafica = false;
  ultimaActualizacion = '';
  errorGrafica = false;

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

  // Divisas soportadas por Frankfurter
  divisasSoportadasFrankfurter = ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY'];

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
    } catch (err) {
      console.error('Error al cargar tasas:', err);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
    await this.cargarHistorico();
  }

  async cargarHistorico(): Promise<void> {
  const origenSoportado = this.divisasSoportadasFrankfurter.includes(this.divisaOrigen);
  const destinoSoportado = this.divisasSoportadasFrankfurter.includes(this.divisaDestino);

  if (!origenSoportado || !destinoSoportado) {
    this.errorGrafica = true;
    this.chartData = null;
    this.cdr.detectChanges();
    return;
  }

  this.errorGrafica = false;
  this.cargandoGrafica = true;
  this.cdr.detectChanges();

  try {
    const hoy = new Date();
    const hace7dias = new Date(hoy);
    hace7dias.setDate(hoy.getDate() - 7);

    const fechaInicio = hace7dias.toISOString().split('T')[0];
    const fechaFin = hoy.toISOString().split('T')[0];

    const data = await firstValueFrom(
      this.http.get<any>(
        `https://api.frankfurter.app/${fechaInicio}..${fechaFin}?from=${this.divisaOrigen}&to=${this.divisaDestino}`
      )
    );

    const labels = Object.keys(data.rates).sort();
    const valores = labels.map(fecha => data.rates[fecha][this.divisaDestino]);

    this.chartData = {
      labels: labels.map(f => {
        const d = new Date(f);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      }),
      datasets: [{
        label: `1 ${this.divisaOrigen} en ${this.divisaDestino}`,
        data: valores,
        fill: true,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointRadius: 5
      }]
    };
  } catch (err) {
    // CORS en localhost → usar datos simulados
    this.generarGraficaSimulada();
  } finally {
    this.cargandoGrafica = false;
    this.cdr.detectChanges();
  }
}

generarGraficaSimulada(): void {
  const labels: string[] = [];
  const valores: number[] = [];
  const hoy = new Date();

  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);
    labels.push(`${fecha.getDate()}/${fecha.getMonth() + 1}`);
    const variacion = this.tasaActual * (1 + (Math.random() - 0.5) * 0.04);
    valores.push(parseFloat(variacion.toFixed(4)));
  }
  valores[6] = this.tasaActual;

  this.chartData = {
    labels,
    datasets: [{
      label: `1 ${this.divisaOrigen} en ${this.divisaDestino} (estimado)`,
      data: valores,
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