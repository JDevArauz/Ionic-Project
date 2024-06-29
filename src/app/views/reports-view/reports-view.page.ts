import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reports-view',
  templateUrl: './reports-view.page.html',
  styleUrls: ['./reports-view.page.scss'],
})
export class ReportsViewPage implements AfterViewInit {
  tecnicos: any[] = []; // Array para almacenar los datos de los técnicos
  categorias: any[] = []; // Array para almacenar los datos de las categorías

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngAfterViewInit() {
    // Se ejecuta después de que la vista se haya inicializado
    this.loadCategoriesChart(); // Cargar datos y crear gráfico de categorías
    this.loadTechniciansChart(); // Cargar datos y crear gráfico de técnicos
  }

  loadTechniciansChart() {
    // Método para cargar los datos del gráfico de técnicos
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>(`${this.authService.getApiUrl()}/incidents/report-filter`).subscribe(
        (data) => {
          this.tecnicos = data;
          // Modificar los datos antes de crear el gráfico
          this.tecnicos.forEach(tec => {
            if (tec.totalPendientes > 1) {
              tec.totalPendientes /= 2;
            }
            if (tec.totalResueltos > 1) {
              tec.totalResueltos /= 2;
            }
          });
          this.createDoughnutChart(); // Llamar a createDoughnutChart después de modificar los datos
        },
        (error) => {
          console.error('Error al recuperar técnicos', error);
        }
      );
    });
  }

  loadCategoriesChart() {
    // Método para cargar los datos del gráfico de categorías
    this.authService.getAccessToken().then((token) => {
      this.http.get<any[]>(`${this.authService.getApiUrl()}/categories/most-popular`).subscribe(
        (data) => {
          this.categorias = data;
          this.createDoughnutChart(); // Llamar a createDoughnutChart después de cargar los datos
        },
        (error) => {
          console.error('Error al recuperar categorías', error);
        }
      );
    });
  }

  createDoughnutChart() {
    // Método para crear un gráfico de tipo doughnut (rosquilla)
    const canvas = document.getElementById('doughnutChart') as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const labels = this.categorias.map(cat => cat.T_Categoria.CT_Descripcion);
        const data = this.categorias.map(cat => cat.cantidad);
        const backgroundColors = ['#3498db', '#9b59b6', '#e74c3c']; // Colores personalizados

        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: backgroundColors,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem: any) => {
                    const label = labels[tooltipItem.index] || '';
                    const value = data[tooltipItem.index] || 0;
                    const total = data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              },
              datalabels: {
                display: true,
                formatter: (value: number, context: any) => {
                  const dataset = context.chart.data.datasets[0];
                  const total = dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0%';
                  return percentage;
                },
                color: '#fff',
                font: {
                  weight: 'bold',
                },
              } as any, // Usar 'as any' para evitar problemas de tipo
            },
          },
        } as any); // Usar 'as any' para evitar problemas de tipo
      }
    }
  }

  downloadPDF() {
    // Método para descargar el contenido como un archivo PDF
    const reportContainer = document.querySelector('.report-container') as HTMLElement | null;
    if (reportContainer) {
      html2canvas(reportContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('reporte.pdf'); // Guardar el archivo PDF con el nombre 'reporte.pdf'
      });
    }
  }
}
