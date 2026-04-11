import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from 'src/app/feature/top-bar/top-bar.component';
import { FooterBarComponent } from 'src/app/feature/footer-bar/footer-bar.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AccessRequestDialogComponent } from '../access-request-dialog/access-request-dialog.component';
import { Router } from '@angular/router';
import { CURRENT_STATE } from './landing.data';


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

  specificObjectives = [
    'Develop a Sinhala language dataset of audio-visual content.',
    'Create a counterfactual negative generator to simulate anomalies.',
    'Develop a multi-granular anomaly detection head.',
    'Build a cross-modal fusion system with offline calibration.',
    'Create a prototype forensic visualization application.'
  ];

  // current state moved to data file
  currentStateText = 'We have almost completed the development and we are currently focus on increasing the accuracy by increasing the dataset and by model fine tuning.';

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.keyFigures.length) % this.keyFigures.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.keyFigures.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }


  abstract = 'The rapid advancement of deepfake generation technologies has become a threat to the integrity of digital media, especially to languages with low resources like Sinhala, which still are not covered by current detection-oriented frameworks. Existing supervised detection techniques are limited to shortcut learning, have poor cross-dataset generalization and fail to offer explainable forensic evidence. This research proposes the Multi-Granular Audio-Visual Forensics (MG-AVF) framework, a bias-resilient deepfake detection system that is specifically designed based on Sinhala audio-visual content. Our MG-AVF framework combines a three-stage architecture. Frozen ResNet3D and HuBERT backbones for feature extraction, a dual-stream granular analysis stage consist of seven specialized forensic heads targeting phoneme-viseme alignment, temporal synchronization, prosody-facial dynamics, semantic-expression consistency, residual artifacts, generative texture artifacts, and Sinhala phonetic authenticity, and a Neuro-Symbolic fusion stage combining self-attention neural fusion with a 30 rule Fuzzy Logic Decision Engine for explainable verdicts. The system is trained exclusively on authentic Sinhala audio-visual data retrieved via YouTube archives, augmented with a counterfactual negative  generation mechanism to reduce dataset specific bias. Evaluation using Binary Cross Entropy loss and F1-score demonstrated strong detection performance, with the Neural Fusion achieving high classification accuracy and the Fuzzy Logic system offering interpretable forensic reasoning. This framework addresses a critical gap in deepfake forensics for under-resourced languages, delivering a calibrated, explainable detection tool suitable for investigative and journalistic applications in the Sri Lankan context.';
  
  objective = 'To design and validate an bias-resilient, multi-granular audio-visual deepfake detector that learns natural audio-visual regularities to support robust generalization and give explainable forensic results, with an explicit emphasis on the lack of research and particular linguistic challenges within the context of Sinhala Language.'

  openAccessDialog() {
    const dialogRef = this.dialog.open(AccessRequestDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  navigateToDemo() {
    this.router.navigate(['/try-demo']);
  }

}
