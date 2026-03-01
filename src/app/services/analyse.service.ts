import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AnalyseResponse, ImageType, ReportType } from '../models/analyse-response.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyseService {

  // Ensure environment.baseUrl is set to your backend, e.g., 'http://localhost:8000'
  private readonly apiUrl = environment.baseUrl; 

  constructor(private http: HttpClient) {}

  connectLogStream(): WebSocket {
    // FIX: Generate WS URL from the API URL, not window.location
    // Replaces 'http://' with 'ws://' and 'https://' with 'wss://'
    const wsBase = this.apiUrl.replace(/^http/, 'ws');
    const wsUrl = `${wsBase}/api/forensics/ws/logs`;

    console.log(`🔌 Connecting to WebSocket at: ${wsUrl}`);
    return new WebSocket(wsUrl);
  }

  /** Upload and analyze a video */
  analyseVideo(file: File, isSinhala: boolean): Observable<AnalyseResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_sinhala', String(isSinhala));
    return this.http.post<AnalyseResponse>(`${this.apiUrl}/api/forensics/detect`, formData)
      .pipe(catchError(this.handleError));
  }

  /** Get status of a specific job */
  getJobStatus(jobId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/forensics/job/${jobId}`)
      .pipe(catchError(this.handleError));
  }

  /** Download report in pdf, html, or json */
  downloadReport(jobId: number, type: ReportType = 'pdf'): Observable<Blob> {
    const params = new HttpParams().set('type', type);
    return this.http.get(`${this.apiUrl}/api/forensics/report/${jobId}`, {
      params,
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /** Get a specific frame image from analysis */
  getFrameImage(jobId: number, frameId: number, type: ImageType = 'gradcam'): Observable<Blob> {
    const params = new HttpParams().set('type', type);
    return this.http.get(`${this.apiUrl}/api/forensics/frame/${jobId}/${type}/${frameId}`, {
      params,
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /** Common HTTP error handler */
  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMsg = `${err.status} ${err.statusText}`;
    
    if (err.error instanceof ProgressEvent) {
      errorMsg = 'Network error - check if backend is running';
    } else if (err.error?.detail) {
      errorMsg = err.error.detail;
    }

    return throwError(() => new Error(errorMsg));
  }
}