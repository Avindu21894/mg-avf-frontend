import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AnalyseResponse, ImageType, ReportType } from '../models/analyse-response.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyseService {

  private readonly apiUrl = environment.baseUrl;

  private readonly hfToken = environment.hfToken;

  constructor(private http: HttpClient) {}

  /** Generates the required Hugging Face Authorization header */
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.hfToken}`
    });
  }

  /** Connect to WebSocket for streaming logs */
  connectLogStream(): WebSocket {
    // Replaces 'https://' with 'wss://' for secure WebSocket connection
    const wsBase = this.apiUrl.replace(/^http/, 'ws').replace(/^https/, 'wss');

    // WebSockets in the browser cannot send standard headers.
    // We append the token to the URL query string so the backend can read it.
    const wsUrl = `${wsBase}/api/forensics/ws/logs?token=${this.hfToken}`;

    console.log(`🔌 Connecting to WebSocket at: ${wsUrl}`);
    return new WebSocket(wsUrl);
  }

  /** Upload and analyze a video */
  analyseVideo(file: File, isSinhala: boolean): Observable<AnalyseResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_sinhala', String(isSinhala));

    return this.http.post<AnalyseResponse>(`${this.apiUrl}/api/forensics/detect`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError.bind(this)));
  }

  /** Get status of a specific job */
  getJobStatus(jobId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/forensics/job/${jobId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError.bind(this)));
  }

  /** Download report in pdf, html, or json */
  downloadReport(jobId: number, type: ReportType = 'pdf'): Observable<Blob> {
    let params = new HttpParams().set('type', type);

    return this.http.get(`${this.apiUrl}/api/forensics/report/${jobId}`, {
      headers: this.getAuthHeaders(),
      params: params,
      responseType: 'blob'
    }).pipe(catchError(this.handleError.bind(this)));
  }

  /** Get a specific frame image from analysis */
  getFrameImage(jobId: number, frameId: number, type: ImageType = 'gradcam'): Observable<Blob> {
    let params = new HttpParams().set('type', type);

    return this.http.get(`${this.apiUrl}/api/forensics/frame/${jobId}/${type}/${frameId}`, {
      headers: this.getAuthHeaders(),
      params: params,
      responseType: 'blob'
    }).pipe(catchError(this.handleError.bind(this)));
  }

  /** Common HTTP error handler */
  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMsg = `${err.status} ${err.statusText}`;

    if (err.error instanceof ProgressEvent) {
      errorMsg = 'Network error - check if backend is running and accessible.';
    } else if (err.error?.detail) {
      errorMsg = err.error.detail;
    }

    console.error('API Error:', errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
