import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Registrar el plugin con Chart.js
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-reports-view',
  templateUrl: './reports-view.page.html',
  styleUrls: ['./reports-view.page.scss'],
})
export class ReportsViewPage implements AfterViewInit {
  tecnicos = [
    { nombre: 'Carlos MC', pendiente: 2500, resueltos: 1000 },
    { nombre: 'Marc BM', pendiente: 750, resueltos: 75 },
    { nombre: 'Juan PZ', pendiente: 100, resueltos: 100 },
  ];

  ngAfterViewInit() {
    this.createDoughnutChart();
  }

  createDoughnutChart() {
    const canvas = document.getElementById('doughnutChart') as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Mobile', 'Desktop', 'Tablet', 'Laptop'],
            datasets: [
              {
                data: [10, 20, 30, 40],
                backgroundColor: ['#3498db', '#9b59b6', '#e74c3c', '#f1c40f'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
              datalabels: {
                formatter: (value, context) => {
                  const total : any = context.chart.data.datasets[0].data.reduce((a, b) => (a as number) + (b as number), 0);
                  const percentage = ((value as number) / total * 100).toFixed(2) + '%';
                  return percentage;
                },
                color: '#fff',
                font: {
                  weight: 'bold',
                },
              },
            },
          },
        });
      }
    }
  }

  downloadPDF() {
    const reportContainer = document.querySelector('.report-container') as HTMLElement | null;
    if (reportContainer) {
      html2canvas(reportContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('reporte.pdf');
      });
    }
  }
}
