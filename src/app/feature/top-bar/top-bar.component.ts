import { Component, ElementRef, AfterViewInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements AfterViewInit {
  @ViewChild('navbar', { static: true }) navbar!: ElementRef;
  @ViewChild('selector', { static: true }) selector!: ElementRef;

  isMenuOpen = false;                       
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.moveSelectorToActive();
    window.addEventListener('resize', () => setTimeout(() => this.moveSelectorToActive(), 200));
  }

  toggleMenu() {                            
    this.isMenuOpen = !this.isMenuOpen;
  }

  setActive(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const a = target.closest('a');
    if (!a) return;
    const sectionId = a.getAttribute('href')?.slice(1);
    if (!sectionId) return;

    const li = a.closest('li');
    if (!li) return;

    this.navbar.nativeElement
      .querySelectorAll('li')
      .forEach((el: HTMLElement) => el.classList.remove('active'));

    li.classList.add('active');
    this.moveSelectorToActive();

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }

    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
  

  moveSelectorToActive() {
    const active = this.navbar.nativeElement.querySelector('li.active') as HTMLElement;
    if (!active) return;

    const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = active;
    this.renderer.setStyle(this.selector.nativeElement, 'top', `${offsetTop}px`);
    this.renderer.setStyle(this.selector.nativeElement, 'left', `${offsetLeft}px`);
    this.renderer.setStyle(this.selector.nativeElement, 'height', `${offsetHeight}px`);
    this.renderer.setStyle(this.selector.nativeElement, 'width', `${offsetWidth}px`);
  }
}