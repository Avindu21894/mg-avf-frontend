import { Component, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
Chart.register(MatrixController, MatrixElement);
import 'chartjs-chart-matrix';
import { FooterBarComponent } from 'src/app/feature/footer-bar/footer-bar.component';
import { Router } from '@angular/router';
import { AnalyseService } from 'src/app/services/analyse.service';
import { AnalyseResponse } from 'src/app/models/analyse-response.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
/* helper for matrix tooltip */
interface HeatCell {
  x: number;
  y: number;
  v: number;
}

@Component({
  selector: 'app-mg-avf',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FooterBarComponent],
  templateUrl: './mg-avf.component.html',
  styleUrls: ['./mg-avf.component.css'],
})
export class MgAvfComponent {
  /* ---------- template refs ---------- */
  @ViewChild('analysisTemplate') analysisTemplate!: TemplateRef<any>;
  @ViewChild('resultsTemplate') resultsTemplate!: TemplateRef<any>;

  /* ---------- state ---------- */
  selectedFile: File | null = null;
  fileName = '';
  isAnalyzing = false;
  showResults = false;
  analysisResult: AnalyseResponse | null = null;
  currentTemplate: TemplateRef<any> | null = null;
  terminalUrl: SafeResourceUrl | null = null;
  isTerminalShow = false;
  private baseUrl = environment.baseUrl;
  terminalLogs: string[] = [];
  logSocket: WebSocket | null = null;
  isSinhala = true;
  constructor(
    private http: HttpClient,
    private router: Router,
    private analyseService: AnalyseService,
    private sanitizer: DomSanitizer,
    private zone: NgZone
  ) {}

  /* ---------- file handling ---------- */
  onFileSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file?.type.startsWith('video/')) {
      this.selectedFile = file;
      this.fileName = file.name;
    } else alert('Please select a valid video file');
  }
  toggleSinhalaMode(e: Event): void {
    e.stopPropagation();
    this.isSinhala = !this.isSinhala;
  }
  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
  onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files[0];
    if (file?.type.startsWith('video/')) {
      this.selectedFile = file;
      this.fileName = file.name;
    } else alert('Please drop a valid video file');
  }
  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  /* ---------- analysis ---------- */
  analyzeVideo(): void {
    if (!this.selectedFile) {
      alert('Please select a video file first');
      return;
    }
    this.isTerminalShow = true;
    this.isAnalyzing = true;
    this.showResults = false;
    this.terminalLogs = [];
    this.currentTemplate = this.analysisTemplate;
    this.logSocket = this.analyseService.connectLogStream();
    this.logSocket.onopen = () => {
      this.zone.run(() => {
        this.terminalLogs.push('🔌 Connected to Forensic Log Stream...');
      });
    };
    this.logSocket.onmessage = (event) => {
      this.zone.run(() => {
        this.terminalLogs.push(event.data);
        this.scrollToBottom();
      });
    };
    this.analyseService
      .analyseVideo(this.selectedFile, this.isSinhala)
      .subscribe({
        next: (res) => {
          this.isTerminalShow = false;
          this.analysisResult = res;
          this.isAnalyzing = false;
          this.showResults = true;
          this.currentTemplate = this.resultsTemplate;
          this.logSocket?.close();
          setTimeout(() => {
            this.renderDistributionChart();
            this.renderRadarChart();
            this.renderPerHeadDistributionCharts();
            this.renderHeatmaps();
          }, 0);
        },
        error: (err) => {
          this.zone.run(() => {
             this.terminalLogs.push(`❌ Error: ${err.message}`);
          });
          this.logSocket?.close();
        },
      });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const element = document.querySelector('.logs-container');
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, 10);
  }

  getDistChartId(headName: string): string {
    return 'distChart_' + headName.replace(/\s+/g, '_');
  }

  /* ---------- chart helpers ---------- */
heatmapKeys(): string[] {
    const keys = Object.keys(this.analysisResult?.heatmaps ?? {});
    if (!this.isSinhala) {
      return keys.filter((k) => k !== 'sinhala_expert');
    }
    return keys;
  }

  private renderDistributionChart(): void {
    if (!this.analysisResult) return;
    const ctx = document.getElementById(
      'distributionChart'
    ) as HTMLCanvasElement;
    if (!ctx) return;
    const fuzzy = this.analysisResult.summary.fuzzy_summary;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Real', 'Borderline', 'Fake'],
        datasets: [
          {
            data: [fuzzy.mean_real, fuzzy.mean_borderline, fuzzy.mean_fake],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => value.toString(),
            },
          },
        },
      },
    });
  }

  private renderRadarChart(): void {
    if (!this.analysisResult) return;
    const ctx = document.getElementById('radarChart') as HTMLCanvasElement;
    if (!ctx) return;

    let stats = this.analysisResult.statistics;
    if (!this.isSinhala) {
      stats = stats.filter((h) => h.head !== 'sinhala');
    }

    const labels = stats.map((h) => h.head);
    const data = stats.map((h) => h.mean_score);
    const minScore = Math.min(...data);
    const maxScore = Math.max(...data);
    const padding = 0.05;
    const scaleMin = Math.max(0, Math.floor((minScore - padding) * 100) / 100);
    const scaleMax = Math.min(1, Math.ceil((maxScore + padding) * 100) / 100);

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Mean Score',
            data,
            fill: true,
            backgroundColor: 'rgba(96,165,250,0.3)',
            borderColor: 'rgba(96,165,250,1)',
            borderWidth: 3,
            pointBackgroundColor: 'rgba(96,165,250,1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            pointRadius: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: false,
            min: scaleMin,
            max: scaleMax,
            grid: {
              color: '#ffffff',
            },
            angleLines: {
              color: '#ffffff',
            },
            pointLabels: {
              color: '#ffffff',
            },
          },
        },
      },
    });
  }

  private renderPerHeadDistributionCharts(): void {
    if (!this.analysisResult) return;
    let stats = this.analysisResult.statistics;
        if (!this.isSinhala) {
      stats = stats.filter((h) => h.head !== 'sinhala');
    }
    stats.forEach((h) => {
      const ctx = document.getElementById(
        `distChart_${h.head.replace(/\s+/g, '_')}`
      ) as HTMLCanvasElement;
      if (!ctx) return;

      const distribution = h.distribution;
      const minVal = Math.min(...distribution);
      const maxVal = Math.max(...distribution);
      const avgVal =
        distribution.reduce((a, b) => a + b, 0) / distribution.length;

      // Create gradient
      const canvas2d = ctx.getContext('2d');
      let gradient;
      if (canvas2d) {
        gradient = canvas2d.createLinearGradient(0, 0, 0, ctx.height);
        gradient.addColorStop(0, 'rgba(96, 165, 250, 0.8)');
        gradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.4)');
        gradient.addColorStop(1, 'rgba(96, 165, 250, 0.1)');
      }

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: distribution.map((_, i) => i),
          datasets: [
            {
              label: 'Frame Scores',
              data: distribution,
              borderColor: '#60a5fa',
              backgroundColor: gradient || 'rgba(96, 165, 250, 0.2)',
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointHoverBackgroundColor: '#60a5fa',
              pointHoverBorderColor: '#fff',
              pointHoverBorderWidth: 2,
            },
            // Average line
            {
              label: 'Average',
              data: Array(distribution.length).fill(avgVal),
              borderColor: '#fbbf24',
              borderWidth: 1.5,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              padding: 10,
              titleColor: '#f3f4f6',
              bodyColor: '#d1d5db',
              borderColor: '#374151',
              borderWidth: 1,
              displayColors: false,
              callbacks: {
                title: (items) => `Frame ${items[0].label}`,
                label: (context) => {
                  if (context.datasetIndex === 0) {
                    const value = context.parsed.y;
                    if (value !== null && value !== undefined) {
                      return [
                        `Score: ${(value * 100).toFixed(1)}%`,
                        `Min: ${(minVal * 100).toFixed(1)}%`,
                        `Max: ${(maxVal * 100).toFixed(1)}%`,
                        `Avg: ${(avgVal * 100).toFixed(1)}%`,
                      ];
                    }
                  }
                  return '';
                },
              },
            },
          },
          scales: {
            x: {
              display: true,
              border: {
                display: false,
              },
              grid: {
                display: false,
              },
              ticks: {
                maxTicksLimit: 6,
                color: '#6b7280',
                font: { size: 9 },
              },
            },
            y: {
              min: Math.max(0, minVal - 0.05),
              max: Math.min(1, maxVal + 0.05),
              border: {
                display: false,
              },
              grid: {
                color: 'rgba(75, 85, 99, 0.2)',
              },
              ticks: {
                color: '#6b7280',
                font: { size: 9 },
                callback: (value) => `${(Number(value) * 100).toFixed(0)}%`,
              },
            },
          },
        },
      });
    });
  }

  private renderHeatmaps(): void {
    if (!this.analysisResult) return;
    const types = this.heatmapKeys();

    types.forEach((type) => {
      const ctx = document.getElementById(
        `heatmap_${type}`
      ) as HTMLCanvasElement;
      if (!ctx) return;

      const scores = this.analysisResult!.heatmaps[type];

      // Find min/max for this specific heatmap to create dynamic color scaling
      const minVal = Math.min(...scores);
      const maxVal = Math.max(...scores);
      const range = maxVal - minVal;

      // Create matrix data
      const data: HeatCell[] = scores.map((v, x) => ({ x, y: 0, v }));

      new Chart(ctx, {
        type: 'matrix',
        data: {
          datasets: [
            {
              label: type,
              data,
              borderWidth: 0.5,
              borderColor: 'rgba(0,0,0,0.1)',
              width: ({ chart }) => {
                const area = chart.chartArea;
                return area ? area.width / scores.length - 0.5 : 10;
              },
              height: ({ chart }) => {
                const area = chart.chartArea;
                return area ? area.height - 2 : 30;
              },
              backgroundColor(ctx) {
                const value = (ctx.dataset.data[ctx.dataIndex] as HeatCell).v;

                // Dynamic color scaling based on actual data range
                if (range > 0) {
                  const normalized = (value - minVal) / range;

                  if (normalized < 0.33) {
                    // Green for lower values
                    return `rgba(76, 175, 80, ${0.6 + normalized * 0.4})`;
                  } else if (normalized < 0.67) {
                    // Yellow for middle values
                    return `rgba(255, 193, 7, ${0.6 + normalized * 0.4})`;
                  } else {
                    // Red for higher values
                    return `rgba(244, 67, 54, ${0.6 + normalized * 0.4})`;
                  }
                }

                // Fallback to original thresholds if no range
                if (value < 0.4) return 'rgba(76,175,80,0.9)';
                if (value < 0.6) return 'rgba(255,193,7,0.9)';
                return 'rgba(244,67,54,0.9)';
              },
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: () => type.replace(/_/g, ' ').toUpperCase(),
                label: (context) => {
                  const cell = context.raw as HeatCell;
                  return [
                    `Frame: ${cell.x}`,
                    `Score: ${(cell.v * 100).toFixed(2)}%`,
                    `Range: ${(minVal * 100).toFixed(2)}% - ${(
                      maxVal * 100
                    ).toFixed(2)}%`,
                  ];
                },
              },
            },
          },
          scales: {
            x: {
              type: 'linear',
              offset: false,
              display: true,
              min: -0.5,
              max: scores.length - 0.5,
              ticks: {
                stepSize: Math.max(1, Math.floor(scores.length / 10)),
                color: '#9ca3af',
                font: { size: 10 },
              },
              grid: { display: false },
            },
            y: {
              type: 'category',
              labels: [''],
              offset: false,
              display: false,
            },
          },
        },
      });
    });
  }
  /* ---------- util ---------- */
  resetAnalysis(): void {
    this.terminalUrl = null;
    this.isTerminalShow = false;
    Object.assign(this, {
      selectedFile: null,
      fileName: '',
      isAnalyzing: false,
      showResults: false,
      analysisResult: null,
      currentTemplate: null,
    });
  }
  downloadReport(): void {
    if (!this.analysisResult) return;
    const jobId = this.analysisResult.job_id;
    this.analyseService
      .downloadReport(jobId, 'pdf')
      .pipe(first())
      .subscribe((blob) => saveAs(blob, `mgavf_report_${jobId}.pdf`));
  }

  flipFrame(frameIdx: number): void {
    const img = document.getElementById(
      `frame-img-${frameIdx}`
    ) as HTMLImageElement | null;
    const card = document.getElementById(`frame-card-${frameIdx}`);
    const spinner = document.getElementById(`spinner-${frameIdx}`);

    if (!img || !card) return;

    // If already loaded, just toggle flip
    if (img.classList.contains('loaded')) {
      card.classList.toggle('flipped');
      return;
    }

    // First flip to show loading
    card.classList.add('flipped');

    // Load the image
    this.analyseService
      .getFrameImage(this.analysisResult!.job_id, frameIdx, 'gradcam')
      .pipe(first())
      .subscribe({
        next: (blob) => {
          img.src = URL.createObjectURL(blob);
          img.onload = () => {
            img.classList.add('loaded');
            if (spinner) {
              spinner.classList.add('hidden');
            }
          };
        },
        error: (err) => {
          console.error('Failed to load frame:', err);
          // Show error state or flip back
          card.classList.remove('flipped');
          alert('Failed to load frame image');
        },
      });
  }

getVerdictClass(): string {
    const label = this.analysisResult?.summary.authenticity_label;
    if (label === 'FAKE') return 'forged';
    if (label === 'SUSPICIOUS') return 'suspicious';
    return 'authentic'; 
  }
  backToHome(): void {
    this.router.navigate(['/']);
  }
}
