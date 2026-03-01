import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from 'src/app/feature/top-bar/top-bar.component';
import { FooterBarComponent } from 'src/app/feature/footer-bar/footer-bar.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AccessRequestDialogComponent } from '../access-request-dialog/access-request-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, TopBarComponent, FooterBarComponent, MatDialogModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements AfterViewInit {
  constructor(private dialog: MatDialog, private router: Router) { }

  @ViewChild('particlesCanvas') particlesCanvasRef!: ElementRef;

  ngAfterViewInit() {
    this.generateParticles();
  }

  generateParticles() {
    const container = this.particlesCanvasRef?.nativeElement;
    if (!container) return;

    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 20 + 8;
      const x = Math.random() * 100;
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 12;
      const drift = (Math.random() - 0.5) * 120;

      p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      bottom: -10px;
      --drift: ${drift}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;
      container.appendChild(p);
    }
  }

  team = [
    { name: 'Gayantha H.L.R.', id: 'ICT/21/840', email: 'hlrgayantha@gmail.com', imagePath: 'assets/images/Reshan.jpeg' },
    { name: 'Nawullage S.H.', id: 'ICT/21/891', email: 'sandunikanawullage201@gmail.com', imagePath: 'assets/images/Sandunika.png' },
    { name: 'Payagalage A.K.', id: 'ICT/21/894', email: 'avindukavinda999@gmail.com', imagePath: 'assets/images/Avindu.jpg' },
  ];

  supervisors = [
    {
      title: 'Supervisor',
      name: 'Dr. (Mrs.) P. L. M. Prabhani',
      desc: 'Senior Lecturer (Grade II)',
      institution: 'Faculty of Technology, University of Sri Jayawardenepura',
      email: 'prabani@sjp.ac.lk',
    },
  ];

  coSupervisors = [
    {
      name: 'Mr. Akalanka Panapitiya',
      desc: 'Lecturer',
      institution: 'Faculty of Technology, University of Sri Jayawardenepura',
      email: 'akalankap@sjp.ac.lk',
    },
    {
      name: 'Ms. Nirasha Kulsooriya',
      desc: 'Lecturer',
      institution: 'Faculty of Technology, University of Sri Jayawardenepura',
      email: 'nirashakulasooriya@sjp.ac.lk',
    },
  ];

  // Add to the class properties
  keyFigures = [
    { imagePath: 'assets/images/use-case.png', caption: 'Figure 1: Use Cases of MG-AVF' },
    { imagePath: 'assets/images/data-flow-diagram.png', caption: 'Figure 2: Data Flow Diagram of MG-AVF' },
    { imagePath: 'assets/images/network-diagram.png', caption: 'Figure 3: Network Diagram of MG-AVF' },
    // add more as needed
  ];

  currentSlide = 0;

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.keyFigures.length) % this.keyFigures.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.keyFigures.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }


  abstract = 'Deepfakes are synthetic media generated via advanced deep-learning techniques that manipulate or fabricate video, audio and images with near-perfect realism. Unlike traditional editing, such forgeries are extremely difficult to detect, posing significant security and ethical challenges. This project introduces an unsupervised, multi-granular Transformer framework tailored for Sinhala audio-visual content, providing a robust forensic tool to distinguish authentic media from malicious deepfakes.Deepfakes are synthetic media generated via advanced deep-learning techniques that manipulate or fabricate video, audio and images with near-perfect realism. Unlike traditional editing, such forgeries are extremely difficult to detect, posing significant security and ethical challenges. This project introduces an unsupervised, multi-granular Transformer framework tailored for Sinhala audio-visual content, providing a robust forensic tool to distinguish authentic media from malicious deepfakes.Deepfakes are synthetic media generated via advanced deep-learning techniques that manipulate or fabricate video, audio and images with near-perfect realism. Unlike traditional editing, such forgeries are extremely difficult to detect, posing significant security and ethical challenges. This project introduces an unsupervised, multi-granular Transformer framework tailored for Sinhala audio-visual content, providing a robust forensic tool to distinguish authentic media from malicious deepfakes.Deepfakes are synthetic media generated via advanced deep-learning techniques that manipulate or fabricate video, audio and images with near-perfect realism. Unlike traditional editing, such forgeries are extremely difficult to detect, posing significant security and ethical challenges. This project introduces an unsupervised, multi-granular Transformer framework tailored for Sinhala audio-visual content, providing a robust forensic tool to distinguish authentic media from malicious deepfakes.Deepfakes are synthetic media generated via advanced deep-learning techniques that manipulate or fabricate video, audio and images with near-perfect realism. Unlike traditional editing, such forgeries are extremely difficult to detect, posing significant security and ethical challenges. This project introduces an unsupervised, multi-granular Transformer framework tailored for Sinhala audio-visual content, providing a robust forensic tool to distinguish authentic media from malicious deepfakes.Deepfakes are synthetic media generated via advanced deep-learning techniques that manipulate or fabricate video, audio and images with near-perfect realism. Unlike traditional editing, such forgeries are extremely difficult to detect, posing significant security and ethical challenges. This project introduces an unsupervised, multi-granular Transformer framework tailored for Sinhala audio-visual content, providing a robust forensic tool to distinguish authentic media from malicious deepfakes.Deepfakes are synthetic media generated via advanced deep-learning techniques that manipulate or fabricate video, audio and images with near-perfect realism. Unlike traditional editing, such forgeries are extremely difficult to detect, posing significant security and ethical challenges. This project introduces an unsupervised, multi-granular Transformer framework tailored for Sinhala audio-visual content, providing a robust forensic tool to distinguish authentic media from malicious deepfakes.Deepfakes are synthetic media generated via advanced deep-learning techniques that manipulate or fabricate video, audio and images with near-perfect realism. Unlike traditional editing, such forgeries are extremely difficult to detect, posing significant security and ethical challenges. This project introduces an unsupervised, multi-granular Transformer framework tailored for Sinhala audio-visual content, providing a robust forensic tool to distinguish authentic media from malicious deepfakes.Deepfakes are synthetic media generated via advanced deep-learning techniques that manipulate or fabricate video, audio and images with near-perfect realism. Unlike traditional editing, such forgeries are extremely difficult to detect, posing significant security and ethical challenges. This project introduces an unsupervised, multi-granular Transformer framework tailored for Sinhala audio-visual content, providing a robust forensic tool to distinguish authentic media from malicious deepfakes.';

  openAccessDialog() {
    const dialogRef = this.dialog.open(AccessRequestDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  navigateToDemo() {
    this.router.navigate(['/try-demo']);
  }

}
